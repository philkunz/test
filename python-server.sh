#!/bin/bash

# Specify the port on which to start the server
PORT=8080

# Optionally specify the directory to serve; defaults to the current directory if not specified
DIRECTORY="."

# Start the HTTP server using Python 3
# Note: The command might vary slightly depending on your Python installation
# For Python version 3.x, you can typically use `python3 -m http.server`
# For Python version 2.x (not recommended), you might use `python -m SimpleHTTPServer`
# The server will serve files from the specified DIRECTORY on the specified PORT
cd $DIRECTORY
python3 -m http.server $PORT
