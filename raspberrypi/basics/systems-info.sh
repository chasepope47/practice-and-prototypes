#!/bin/bash
vcgencmd measure_temp
cat /proc/cpuinfo | grep Model