<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
  <form method="GET" action="/list">
    <input type="text" name="q" id="q" value="{{query}}">
    <input type="submit" value="search">
  </form>
  <table>
    {{>list}}
  </table>

    {{#hasMore}}
    {{>older}}
    {{/hasMore}}

    {{#notFirstPage}}
    {{>newer}}
    {{/notFirstPage}}
</body>
</html>
