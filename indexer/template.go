package main

import (
	"html/template"
	"log"
	"strings"
)

var htmlTemplate = parseTemplateString(`<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Index of {{.FullPath}}</title>
	</head>
	<body>!!
		<h1>Index of {{.FullPath}}</h1>

		<p><a href="..">Go Parent Directory</a></p>!!
		<table>!!
			<thead>!!
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>LinkedTo</th>
					<th>Bytes</th>
					<th>FullPath</th>
					<th>LastUpdate</th>
					<th>TotalChildrenCount</th>
				</tr>!!
			</thead>!!
			<tbody>!!
				<tr>
					<td>.</td>
					<td>{{.Type}}</td>
					<td><a href="{{.LinkedTo}}">{{.LinkedTo}}</a></td>
					<td>{{.Bytes}} ({{.BytesReadable}})</td>
					<td>{{.FullPath}}</td>
					<td>{{.LastUpdate}}</td>
					<td>{{.TotalChildrenCount}}</td>
				</tr>!!
				{{range .DirectChildren}}
				<tr>
					<td><a href="{{.FullPath}}">{{.Name}}</a></td>
					<td>{{.Type}}</td>
					<td><a href="{{.LinkedTo}}">{{.LinkedTo}}</a></td>
					<td>{{.Bytes}} ({{.BytesReadable}})</td>
					<td>{{.FullPath}}</td>
					<td>{{.LastUpdate}}</td>
					<td>{{.TotalChildrenCount}}</td>
				</tr>!!
				{{end}}
			</tbody>!!
		</table>!!
	</body>
</html>`)

func parseTemplateString(str string) *template.Template {
	str = strings.ReplaceAll(str, "\t", "")
	str = strings.ReplaceAll(str, "\n", "")
	str = strings.ReplaceAll(str, "!!", "\n")

	t, err := template.New("webpage").Parse(str)
	if err != nil {
		log.Fatalln(err)
	}

	return t
}
