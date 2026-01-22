export default {
  async fetch(req) {
    const url = new URL(req.url)
    url.pathname = '/__scheduled'
    url.searchParams.append('cron', '* * * * *')
    return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`)
  },

  async scheduled(_, env): Promise<void> {
    const zoneId = env.TARGET_ZONE_ID
    const zoneDomain = env.TARGET_DOMAIN_NAME
    const apiToken = env.HEALTHZ_CLOUDFLARE_API_TOKEN
    const ips = env.TARGET_IPS.split(',')
    const ip6s = env.TARGET_IP6.split(',')
    const acceptedIps: string[] = []
    const acceptedIp6s: string[] = []

    for (const ip of ips) {
      let res = await fetch(`http://${ip}/lastsync`, {
        signal: AbortSignal.timeout(5000)
      })
        .then((res) => res.text())
        .catch(() => undefined)

      if (res === undefined) continue

      try {
        const lastsync = parseInt(res)
        const limits = (Date.now() - 2 * 60 * 60 * 1000) / 1000

        if (limits > lastsync) continue
        acceptedIps.push(ip)
      } catch {}
    }

    for (const ip6 of ip6s) {
      let res = await fetch(`http://[${ip6}]/lastsync`, {
        signal: AbortSignal.timeout(5000)
      })
        .then((res) => res.text())
        .catch(() => undefined)

      if (res === undefined) continue

      try {
        const lastsync = parseInt(res)
        const limits = (Date.now() - 2 * 60 * 60 * 1000) / 1000

        if (limits > lastsync) continue
        acceptedIp6s.push(ip6)
      } catch {}
    }

    console.log(`health check finished. accepted ipv4: ${acceptedIps.join(', ')}. accepted ipv6: ${acceptedIp6s.join(', ')}`)

    const httpsRecord = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?type=HTTPS&comment.contains=healthz:https`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`
        }
      }
    ).then((res) => res.json() as any)

    const httpsRecordData = httpsRecord.result?.[0]
    if (typeof httpsRecordData?.id !== 'string') return
    if (httpsRecordData.content !== `1 . alpn="h3,h2" ipv4hint="${acceptedIps.join(',')}"`) {
      const httpsRecordResult = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${httpsRecordData.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: httpsRecordData.name,
          ttl: httpsRecordData.ttl,
          type: 'HTTPS',
          data: {
            priority: 1,
            target: '.',
            value: `alpn="h3,h2" ipv4hint="${acceptedIps.join(',')}" ipv6hint="${acceptedIp6s.join(',')}"`
          }
        })
      })

      if (!httpsRecordResult.ok) return
      console.log('HTTPS zone updated.')
    }

    const aRecords = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?type=A&comment.contains=healthz:a`, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    }).then((res) => res.json() as any)

    for (const aRecord of aRecords.result) {
      if (acceptedIps.includes(aRecord.content)) continue

      await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${aRecord.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiToken}`
        }
      })
      console.log(`A record deleted: ${aRecord.content}`)
    }

    for (const acceptedIp of acceptedIps) {
      if (aRecords.result.find((v: any) => v.content === acceptedIp) !== undefined) continue

      await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: zoneDomain,
          type: 'A',
          content: acceptedIp,
          ttl: 1,
          proxied: false,
          comment: 'healthz:a'
        })
      })

      console.log(`A record: ${acceptedIp} created.`)
    }

    const aaaaRecords = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?type=AAAA&comment.contains=healthz:aaaa`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`
        }
      }
    ).then((res) => res.json() as any)

    for (const aaaaRecord of aaaaRecords.result) {
      if (acceptedIp6s.includes(aaaaRecord.content)) continue

      await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${aaaaRecord.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiToken}`
        }
      })
      console.log(`AAAA record deleted: ${aaaaRecord.content}`)
    }

    for (const acceptedIp6 of acceptedIp6s) {
      if (aaaaRecords.result.find((v: any) => v.content === acceptedIp6) !== undefined) continue

      await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: zoneDomain,
          type: 'AAAA',
          content: acceptedIp6,
          ttl: 1,
          proxied: false,
          comment: 'healthz:aaaa'
        })
      })

      console.log(`AAAA record: ${acceptedIp6} created.`)
    }
  }
} satisfies ExportedHandler<Env>
