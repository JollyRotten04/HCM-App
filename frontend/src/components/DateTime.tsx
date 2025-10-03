// Imports...
import { useState, useEffect } from "react";

export default function DateTime() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const date = now.toLocaleDateString("en-CA");
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const time = now.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    return (
        <div>
            <div className="bg-[#cfcfcf] p-4 rounded-lg flex">

            <p className="inter-semilight text-black select-none">{`${date}, ${day}, ${time}`}</p>    
        </div>
    </div>
  );
}
