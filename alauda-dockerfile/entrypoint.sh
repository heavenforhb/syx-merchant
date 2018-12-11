#!/bin/bash
echo nameserver  10.100.1.50  > /etc/resolv.conf
echo nameserver  10.200.1.50  >> /etc/resolv.conf
echo nameserver  202.106.0.20  >> /etc/resolv.conf
echo nameserver  219.141.140.10  >> /etc/resolv.conf

exec "$@"