#!/bin/bash
/usr/bin/pm2 delete all
cd /home/ubuntu/app/qa
/usr/bin/npm install
cd /home/ubuntu/app/qa/bin
/usr/bin/pm2 start www