#!/usr/bin/env bash
npm run build && rsync -av --delete -e "ssh -i $HOME/.ssh/dbwebb" build/ owsu23@ssh.student.bth.se:www/editor
