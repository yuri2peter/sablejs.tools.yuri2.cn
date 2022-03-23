#!/bin/sh

kill -9 $(lsof -i tcp:8000 -t)
echo 端口8000已释放