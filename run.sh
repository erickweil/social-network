#!/bin/bash
# run_ios_sim builds and runs an iOS app on the simulator
#
# It is designed to replicate the behavior of "Run" in Xcode and assumes basic
# xcodebuild usage.
# 
# USAGE:
# export IOS_SIM_UDID=342F9A20-DF48-41A9-BE60-C6B35F47E97F; \
# export BUNDLE_IDENTIFIER=a.Some; \
# export APP_PATH=$PWD/Build/Debug-iphonesimulator/$APP_NAME.app \
# /path/to/run_ios_sim.sh 
#
# Note that the UDID must match a device where runtime is installed See
# available devices with "simctl list"
#
# Additionally, it supports the ability to wait and attach LLDB in a similar
# fashion that Xcode does.
# export DEBUGGER_ENABLED=1|0
#
# Tested on Xcode 8.3.1 a few times
# Author: Jerry Marino - @jerrymarino

APP_NAME=`echo ""${APP_PATH##*/}"" | cut -d'.' -f1`

echo "Running sim for $APP_NAME - $BUNDLE_IDENTIFIER"

# If the booted simulator does not match, then we need to restart it. Expect an
# output list of the form
# "Phone: iPhone 7 Plus (342F9A20-DF48-41A9-BE60-C6B35F47E97F) (Booted)"
BOOTED_UDID=`xcrun simctl list | grep Booted | perl -pe 's/(.*\()(.*)\)+ (.*)/\2/' | sed -n 1p`
if [[ $BOOTED_UDID != $IOS_SIM_UDID ]]; then
	killall 'Simulator'
else
	# FIXME: We don't need to do this for all cases and
	# it is slow
	killall 'Simulator'
fi

# Open the simulator
open -a 'Simulator' --args -CurrentDeviceUDID $IOS_SIM_UDID

# Wait until there is a device booted

function booted_sim_ct() {
	echo `xcrun simctl list | grep Booted | wc -l | sed -e 's/ //g'`
}

while [ `booted_sim_ct` -lt 1 ]
do
	sleep 1
done

echo "Installing app at path $APP_PATH"
xcrun simctl install booted $APP_PATH

if [[ $DEBUGGER_ENABLED == "1" ]]; then
	LAUNCH_DEBUGGER_ENABLED_FLAG=--wait-for-debugger
	USE_CONSOLE_FLAG=""
else
	USE_CONSOLE_FLAG=--console
	LAUNCH_DEBUGGER_ENABLED_FLAG=""
fi

LOG_FILE=/tmp/run_ios_sim.log
echo "Starting Sim for $APP_PATH" > $LOG_FILE

# Launch the app program into the booted sim
# - Pipe the output to a log file
# - Run in the background
`xcrun simctl launch $LAUNCH_DEBUGGER_ENABLED_FLAG $USE_CONSOLE_FLAG booted $BUNDLE_IDENTIFIER 2>&1 >> $LOG_FILE` &

LAUNCH_SHELL_PID=$!

function newest_related_process() {
	echo `ps aux | grep $APP_NAME.app/$APP_NAME | grep -v -e "*.grep" | sort -k 4nr,4  | awk '{ print ( $2 > 
'$LAUNCH_SHELL_PID' ) ? $2 : "" }' | grep -v -e '^$' | head -1`
}

# Wait for the process to launch. We need to get the PID of the launched App
_Z=`newest_related_process`
_X=0
while [[ "$_Z" != "$_X" ]]
do
	sleep 1
	_Z=$_X
	_X=`newest_related_process`
	echo "waiting for process.."
done

APP_PID=$_X

if [[ $DEBUGGER_ENABLED == "1" ]]; then
	# Manually startup LLDB.
	echo "$APP_NAME running at pid $APP_PID, waiting for lldb.."
	lldb -p $APP_PID
else
	# If not debugging read the log file
	# when the log closes, the app will terminate
	echo "$APP_NAME running at pid $APP_PID"
	tail -f $LOG_FILE
fi
