// Imported components...
import IncreaseIcon from '../assets/increaseIcon.svg';
import DecreaseIcon from '../assets/decreaseIcon.svg';
import { useKPIStats } from '../contexts/KPIStatsContext';
import { useState, useEffect } from 'react';

export default function KPIMetrics({ selectedTimePeriod }){
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { setStatsContext } = useKPIStats();

    useEffect(() => {
    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const period = selectedTimePeriod.toLowerCase();

            let dateParam = "";

            if (period === "daily") {
                // Use today's date for daily
                dateParam = new Date().toISOString().split('T')[0];
            } else if (period === "weekly") {
                // Past 7 days as comma-separated string or however backend expects
                const dates: string[] = [];
                for (let i = 0; i < 7; i++) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    dates.push(d.toISOString().split('T')[0]);
                }
                // join by comma if backend expects multiple dates
                dateParam = dates.join(',');
            }

            const response = await fetch(`http://localhost:5000/api/auth/employee-stats?date=${dateParam}&period=${period}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                setStats(data); // Saves data locally...
                setStatsContext(data); // Saves data to context...
            } else {
                console.error('Failed to fetch employee stats');
            }
        } catch (error) {
            console.error('Error fetching employee stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchStats();
}, [selectedTimePeriod]);


    // Calculate percentages and determine if metrics are meeting targets
    const calculateMetrics = (category) => {
        if (!stats) return { count: 0, percentage: 0, isGood: false };
        
        const count = stats.summary[`${category}Count`] || 0;
        const total = stats.summary.total || 1;
        const percentage = ((count / total) * 100).toFixed(1);
        
        // Define what's "good" for each category
        let isGood = false;
        if (category === 'regularHours') {
            isGood = percentage >= 70; // Good if 70%+ are regular hours
        } else if (category === 'overtime') {
            isGood = percentage <= 20; // Good if overtime is 20% or less
        } else if (category === 'undertime' || category === 'absent' || category === 'late') {
            isGood = percentage <= 10; // Good if undertime/absent/late is 10% or less
        } else if (category === 'nightDifferential') {
            isGood = true; // Or define your own criteria
        }
        
        return { count, percentage, isGood };
    };

    const regularMetrics = calculateMetrics('regularHours');
    const overtimeMetrics = calculateMetrics('overtime');
    const undertimeMetrics = calculateMetrics('undertime');
    const lateMetrics = calculateMetrics('late');
    const nightDiffMetrics = calculateMetrics('nightDifferential');

    return(
        <>
            {/* KPI Containers */}
            <div draggable='false' className="flex justify-evenly portrait:grid portrait:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] place-items-center gap-4">

                {/* Regular Hours */}
                <div draggable='false' className="p-4 bg-[#cfcfcf] rounded-lg aspect-square max-h-48 w-48 flex flex-col justify-between">

                    <div className="items-center flex flex-col">
                        <p className="text-black select-none text-lg text-center inter-light">Regular Hours</p>

                        {/* Performance Stat */}
                        <div className="flex items-center">
                            <img draggable='false' className="h-4 select-none" src={regularMetrics.isGood ? IncreaseIcon : DecreaseIcon} alt="" />

                            <p className={`${regularMetrics.isGood ? 'text-green-500' : 'text-red-500'} select-none text-base inter-semilight`}>
                                {regularMetrics.percentage}%
                            </p>
                        </div>
                    </div>

                    {/* Number of Employees in Regular Category */}
                    <div className="flex flex-col items-center">
                        <p className="text-black select-none text-4xl inter-semilight">
                            {isLoading ? '...' : regularMetrics.count}
                        </p>
                        <p className="text-black select-none text-xl inter-light">Employee/s</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-black select-none text-xs inter-light">
                            Value: <span className={`${regularMetrics.isGood ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                                {regularMetrics.percentage}%
                            </span>
                        </p>

                        <p className="text-black select-none text-xs inter-light">
                            Target: <span className="text-green-500 font-semibold">{">70%"}</span>
                        </p>
                    </div>
                </div>

                {/* Overtime */}
                <div draggable='false' className="p-4 bg-[#cfcfcf] rounded-lg aspect-square max-h-48 w-48 flex flex-col justify-between">

                    <div className="items-center flex flex-col">
                        <p className="text-black select-none text-lg text-center inter-light">Overtime</p>

                        {/* Performance Stat */}
                        <div className="flex items-center">
                            <img draggable='false' className="h-4 select-none" src={overtimeMetrics.isGood ? IncreaseIcon : DecreaseIcon} alt="" />

                            <p className={`${overtimeMetrics.isGood ? 'text-green-500' : 'text-red-500'} select-none text-base inter-semilight`}>
                                {overtimeMetrics.percentage}%
                            </p>
                        </div>
                    </div>

                    {/* Number of Employees in Overtime Category */}
                    <div className="flex flex-col items-center">
                        <p className="text-black select-none text-4xl inter-semilight">
                            {isLoading ? '...' : overtimeMetrics.count}
                        </p>
                        <p className="text-black select-none text-xl inter-light">Employee/s</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-black select-none text-xs inter-light">
                            Value: <span className={`${overtimeMetrics.isGood ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                                {overtimeMetrics.percentage}%
                            </span>
                        </p>

                        <p className="text-black select-none text-xs inter-light">
                            Target: <span className="text-green-500 font-semibold">{"<20%"}</span>
                        </p>
                    </div>
                </div>

                {/* Night Differential */}
                <div draggable='false' className="p-4 bg-[#cfcfcf] rounded-lg aspect-square max-h-48 w-48 flex flex-col justify-between">

                    <div className="items-center flex flex-col">
                        <p className="text-black select-none text-lg text-center inter-light">Night Differential</p>

                        {/* Performance Stat */}
                        <div className="flex items-center">
                            <img draggable='false' className="h-4 select-none" src={nightDiffMetrics.isGood ? IncreaseIcon : DecreaseIcon} alt="" />

                            <p className={`${nightDiffMetrics.count === 0 ? 'text-gray-500' : (nightDiffMetrics.isGood ? 'text-green-500' : 'text-red-500')} select-none text-base inter-semilight`}>
                                {nightDiffMetrics.count === 0 ? 'N/A' : `${nightDiffMetrics.percentage}%`}
                            </p>
                        </div>
                    </div>

                    {/* Number of Employees in Night Differential Category */}
                    <div className="flex flex-col items-center">
                        <p className="text-black select-none text-4xl inter-semilight">
                            {isLoading ? '...' : nightDiffMetrics.count}
                        </p>
                        <p className="text-black select-none text-xl inter-light">Employee/s</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-black select-none text-xs inter-light">
                            Value: <span className={`${nightDiffMetrics.count === 0 ? 'text-gray-500' : (nightDiffMetrics.isGood ? 'text-green-500' : 'text-red-500')} font-semibold`}>
                                {nightDiffMetrics.count === 0 ? 'N/A' : `${nightDiffMetrics.percentage}%`}
                            </span>
                        </p>

                        <p className="text-black select-none text-xs inter-light">
                            Target: <span className="text-green-500 font-semibold">N/A</span>
                        </p>
                    </div>
                </div>

                {/* Late */}
                <div draggable='false' className="p-4 bg-[#cfcfcf] rounded-lg aspect-square max-h-48 w-48 flex flex-col justify-between">

                    <div className="items-center flex flex-col">
                        <p className="text-black select-none text-lg text-center inter-light">Late</p>

                        {/* Performance Stat */}
                        <div className="flex items-center">
                            <img draggable='false' className="h-4 select-none" src={lateMetrics.isGood ? IncreaseIcon : DecreaseIcon} alt="" />

                            <p className={`${lateMetrics.isGood ? 'text-green-500' : 'text-red-500'} select-none text-base inter-semilight`}>
                                {lateMetrics.percentage}%
                            </p>
                        </div>
                    </div>

                    {/* Number of Employees in Late Category */}
                    <div className="flex flex-col items-center">
                        <p className="text-black select-none text-4xl inter-semilight">
                            {isLoading ? '...' : lateMetrics.count}
                        </p>
                        <p className="text-black select-none text-xl inter-light">Employee/s</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-black select-none text-xs inter-light">
                            Value: <span className={`${lateMetrics.isGood ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                                {lateMetrics.percentage}%
                            </span>
                        </p>

                        <p className="text-black select-none text-xs inter-light">
                            Target: <span className="text-green-500 font-semibold">{"<10%"}</span>
                        </p>
                    </div>
                </div>

                {/* Undertime */}
                <div draggable='false' className="p-4 bg-[#cfcfcf] rounded-lg aspect-square max-h-48 w-48 flex flex-col justify-between">

                    <div className="items-center flex flex-col">
                        <p className="text-black select-none text-lg text-center inter-light">Undertime</p>

                        {/* Performance Stat */}
                        <div className="flex items-center">
                            <img draggable='false' className="h-4 select-none" src={undertimeMetrics.isGood ? IncreaseIcon : DecreaseIcon} alt="" />

                            <p className={`${undertimeMetrics.isGood ? 'text-green-500' : 'text-red-500'} select-none text-base inter-semilight`}>
                                {undertimeMetrics.percentage}%
                            </p>
                        </div>
                    </div>

                    {/* Number of Employees in Undertime Category */}
                    <div className="flex flex-col items-center">
                        <p className="text-black select-none text-4xl inter-semilight">
                            {isLoading ? '...' : undertimeMetrics.count}
                        </p>
                        <p className="text-black select-none text-xl inter-light">Employee/s</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-black select-none text-xs inter-light">
                            Value: <span className={`${undertimeMetrics.isGood ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                                {undertimeMetrics.percentage}%
                            </span>
                        </p>

                        <p className="text-black select-none text-xs inter-light">
                            Target: <span className="text-green-500 font-semibold">{"<10%"}</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}