#!/bin/bash

sudo cp lib/* /lib64
sudo yum install -y libstdc++-devel
echo 'Installed Castle' > install.log