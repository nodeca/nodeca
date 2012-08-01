#!/usr/bin/env sh

NODECA_PID=""

start_nodeca() {
  test "x" != "x$NODECA_PID" && kill -9 $NODECA_PID
  node ./nodeca.js server & NODECA_PID=$!
}

# Initial start
start_nodeca

inotifywait -m -r --format '%w%f' -e modify -e move -e create -e delete node_modules | while read f ; do
  # when not excluded
  (echo $f | egrep -v -q '\.swpx?$|/\.git/') && \
    # and actually included
    (echo $f | egrep -q '\.(js|css|styl|less|ejs|jade)$') && \
      # restart server
      start_nodeca
done
