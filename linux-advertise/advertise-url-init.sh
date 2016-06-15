#! /bin/sh
# /etc/init.d/advertise-url 

### BEGIN INIT INFO
# Provides:          ble beacon advertising
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start and Stop Eddystone beacon
# Description:       A script for starting/stopping eddystone beacons created as part of http://isstudios.net/2016/06/12/building-eddystone-beacon-part-1/
### END INIT INFO

# If you want a command to always run, put it here

# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "Starting advertise-url"
    # run application you want to start
    /usr/local/bin/advertise-url
    ;;
  stop)
    echo "Stopping advertise-url"
    # kill application you want to stop
    killall advertize-url
    ;;
  *)
    echo "Usage: /etc/init.d/advertise-url {start|stop}"
    exit 1
    ;;
esac

exit 0