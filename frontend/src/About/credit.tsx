function AboutCredit() {
  return (
    <div id="credit" className="w-full flex justify-center flex-col py-6">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col w-fit leading-none">
          <h1 className="font-bold italic font-display text-5xl">
            <span className="font-thin">ftp</span>.io.kr.
          </h1>
        </div>

        <div className="text-xs text-center max-w-lg">
          <p>
            &copy; 2025-{new Date().getFullYear()}.{' '}
            <a href="https://github.com/pmh-only" target="_blank">
              Minhyeok Park.
            </a>
            &nbsp; &lt;
            <a href="mailto:pmh_only@pmh.codes" target="_blank">
              pmh_only@pmh.codes
            </a>
            &gt;
          </p>
          <details>
            <summary className="cursor-pointer hover:underline">
              Legal infos & policy
            </summary>
            The source code for custom components used by this service
            (including the indexer, statistics collector, and frontend) is
            publicly available. Unless explicitly stated otherwise, these
            components are source-available software and are not free software
            or open-source software. Configuration files and scripts are free
            software and are provided under their respective licenses. This
            service uses third-party software such as nginx, vsftpd, and other
            open-source components. All such software is copyrighted by their
            respective authors and distributed under their own licenses. All
            Arch Linux packages, repositories, and ISO images provided by this
            mirror are copyrighted works of their respective authors and
            contributors. We do not claim ownership of any Arch Linux binaries,
            packages, source code, or ISO images, and they are distributed in
            accordance with their original licenses. The custom components of
            this service (excluding configuration files and scripts) may not be
            used for commercial purposes and may not be used to operate another
            public mirror. Use for internal or private mirror services is
            permitted. This service is provided “as is” and “as available”,
            without warranties of any kind. We do not guarantee availability or
            uptime and accept no responsibility or liability for downtime,
            service interruption, or any damages arising from use of this
            service. By using this service or any of its software components,
            you acknowledge that you have read, understood, and agree to this
            notice and its terms.
          </details>
          <p>
            [1] In case of abuse, misuse, or activities that negatively affect
            the service, we may inspect relevant technical information such as
            IP addresses and autonomous system numbers (ASN). We reserve the
            right to restrict or block access based on such information.
          </p>
          <p>
            This mirror is an independent service and is not affiliated with or
            endorsed by Arch Linux or its contributors.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutCredit
