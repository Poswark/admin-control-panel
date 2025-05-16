#!/bin/sh

echo "window._env_ = {" > /usr/share/nginx/html/env-config.js
echo "  REACT_APP_MESSAGE: \"${REACT_APP_MESSAGE}\"" >> /usr/share/nginx/html/env-config.js
echo "};" >> /usr/share/nginx/html/env-config.js

exec "$@"