import { Grid } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import StatCard from "../common/StatCard";

/**
 * 대시보드 통계 카드 그리드
 * @param {Object} props
 * @param {{ userCount: number, courseCount: number }} props.stats - 통계 데이터
 */
export default function DashboardStats({ stats }) {
    const cards = [
        {
            title: "총 회원 수",
            value: stats.userCount,
            icon: <PeopleIcon fontSize="large" color="primary" />,
        },
        {
            title: "총 강의 수",
            value: stats.courseCount,
            icon: <MenuBookIcon fontSize="large" color="secondary" />,
        },
    ];

    return (
        <Grid container spacing={2}>
            {cards.map((card) => (
                <Grid item xs={12} sm={4} key={card.title}>
                    <StatCard {...card} />
                </Grid>
            ))}
        </Grid>
    );
}
