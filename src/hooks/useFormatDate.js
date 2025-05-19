import { useCallback } from "react";

export default function useFormatDate() {
    const formatDate = useCallback((dateString) => {
        const date = new Date(dateString);
        const pad = (num) => String(num).padStart(2, "0");

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hour = pad(date.getHours());
        const minute = pad(date.getMinutes());

        return `${year}.${month}.${day} ${hour}:${minute}`;
    }, []);

    return formatDate;
}
