# the shell script is used to calculate perfered machines for each job group based on a given build ID.
#usage: bash calc_prefered_machines.sh [sle|Tumbleweed|leap]  > [sle|Tumbleweed|leap].json
# merge the json files:  jq -s '.|add' leap.json Tumbleweed.json sle.json
#
if [ "$1" == "sle" ]; 
then
	gid=$(curl  -s -H "Accept: application/json" "https://openqa.suse.de/api/v1/job_groups" |jq -j '.[]|select(.parent_id == 15)|"\(.id) "')
	bid=163.1
	for i in $gid
		do
			curl  -s -H "Accept: application/json" "https://openqa.suse.de/api/v1/jobs?groupid=${i}&build=${bid}&latest=1&version=15-SP3"|jq '.jobs|{(.[0].group): ([group_by(.settings.ARCH)|.[]|{(.[0].settings.ARCH): (group_by(.settings.MACHINE)|sort_by(length)|.[-1]|.[0].settings.MACHINE)}]|add)}'

		done

elif [ "$1" == "Tumbleweed" ]
then	
	gid=$(curl  -s -H "Accept: application/json" "https://openqa.opensuse.org/api/v1/job_groups" |jq -j '.[]|select(.parent_id == null and (.name|contains("Tumbleweed")))|"\(.id) "')
	bid=20210328
	for i in $gid 50
		do
			curl  -s -H "Accept: application/json" "https://openqa.opensuse.org/api/v1/jobs?groupid=${i}&build=${bid}&latest=1&version=Tumbleweed"|jq '.jobs|{(.[0].group): ([group_by(.settings.ARCH)|.[]|{(.[0].settings.ARCH): (group_by(.settings.MACHINE)|sort_by(length)|.[-1]|.[0].settings.MACHINE)}]|add)}'

		done

elif [ "$1" == "leap" ]
then	
	bid=117.13 
			curl  -s -H "Accept: application/json" "https://openqa.opensuse.org/api/v1/jobs?groupid=50&build=${bid}&latest=1&version=15.3"|jq '.jobs|{(.[0].group): ([group_by(.settings.ARCH)|.[]|{(.[0].settings.ARCH): (group_by(.settings.MACHINE)|sort_by(length)|.[-1]|.[0].settings.MACHINE)}]|add)}'

else

echo "$1 is not supported yet"	

fi	
