import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

// Icons
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SalesDetailChart = ({ data }) => {
  const [month, setMonth] = useState('October');

  // بيانات تجريبية - سيتم استبدالها ببيانات فعلية من API
  const labels = Array.from({ length: 12 }, (_, i) => `${(i + 1) * 5}k`);

  // توليد بيانات مشابهة للرسم البياني المطلوب
  const salesData = [20, 30, 45, 40, 35, 45, 35, 45, 50, 45, 25, 30, 45, 40, 60, 80, 35, 45, 40, 45, 50, 45, 25, 30, 45, 75, 65, 55, 45, 50];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: salesData.slice(0, labels.length),
        borderColor: 'rgba(65, 105, 225, 1)',
        backgroundColor: 'rgba(65, 105, 225, 0.2)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(65, 105, 225, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgba(65, 105, 225, 1)',
        fill: true,
        tension: 0.3, // منحنى لطيف للخط
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              // تنسيق القيمة مع إضافة علامة %
              label += context.parsed.y + '%';
            }
            return label;
          },
          title: function (context) {
            // إظهار رقم محدد فوق النقطة المحددة (مثل المبلغ)
            if (context[0].dataIndex === 4) { // مثال لنقطة معينة
              return '64,3664.77';
            }
            return context[0].label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: function (value) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      }
    },
    elements: {
      line: {
        tension: 0.3 // منحني لطيف للخط
      }
    }
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: '12px', height: '400px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Sales Details</Typography>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <Select value={month} onChange={handleMonthChange}>
            <MenuItem value="October">October</MenuItem>
            <MenuItem value="November">November</MenuItem>
            <MenuItem value="December">December</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ height: '320px' }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Paper>
  );
};

const PaymentGraph = ({ data }) => {
  const chartData = {
    labels: ['Last Month', 'Last Week', 'Yesterday'], // التسميات المحورية
    datasets: [
      {
        label: 'Payment Changes',
        data: [
          parseFloat(data.payments.percentage_change_last_month),  // التحويل من النسبة المئوية إلى قيمة عددية
          parseFloat(data.payments.percentage_change_last_week),
          parseFloat(data.payments.percentage_change_yesterday)
        ],
        borderColor: 'rgba(75,192,192,1)', // لون الخط
        backgroundColor: 'rgba(75,192,192,0.2)', // لون الخلفية
        fill: true,
      },
    ],
  };


};

const PlaceholderChart = ({ title }) => (
  <Paper elevation={2} sx={{ p: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
    <Typography variant="h6" color="textSecondary">{title} Placeholder</Typography>
  </Paper>
);

const StatCard = ({ icon, title, value, change, changeType, iconBgColor }) => (
  <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '12px', height: '100%' }}>
    <Avatar sx={{ bgcolor: iconBgColor || 'primary.main', color: '#fff', width: 56, height: 56, mr: 2 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="h6" gutterBottom>{value}</Typography>
      <Typography color="textSecondary" sx={{ mb: 0.5 }}>{title}</Typography>
      {change && (
        <Typography variant="caption" color={changeType === 'increase' ? 'success.main' : 'error.main'}>
          {changeType === 'increase' ? '▲' : '▼'} {change}
        </Typography>
      )}
    </Box>
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null); 

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/dashboard/')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch dashboard data:', err));
  }, []);

  if (!stats) {
    return <Typography>Loading...</Typography>;
  }

  const adminStatsData = [
    {
      icon: <PeopleOutlineIcon sx={{ color: '#fff' }} />,
      title: 'Total Students',
      value: stats.statistics.total_students,
      change: stats.courses.percentage_change_last_month,
      changeType: 'increase',
      iconBgColor: '#4CAF50'
    },
    {
      icon: <SchoolOutlinedIcon sx={{ color: '#fff' }} />,
      title: 'Total Orders',
      value: stats.statistics.total_orders,
      change: stats.courses.percentage_change_last_week,
      changeType: 'increase',
      iconBgColor: '#FFC107'
    },
    {
      icon: <AttachMoneyOutlinedIcon sx={{ color: '#fff' }} />,
      title: 'Total Earnings',
      value: stats.statistics.total_earnings,
      change: stats.courses.percentage_change_last_month_courses,
      changeType: stats.courses.percentage_change_last_month_courses.includes('Down') ? 'decrease' : 'increase',
      iconBgColor: '#2196F3'
    },
    {
      icon: <HourglassEmptyOutlinedIcon sx={{ color: '#fff' }} />,
      title: 'Pending Enrollments',
      value: stats.statistics.total_pending,
      change: stats.courses.percentage_change_yesterday,
      changeType: 'increase',
      iconBgColor: '#F44336'
    },
    {
      icon: <PersonAddAlt1Icon sx={{ color: '#fff' }} />,
      title: 'New Students (Month)',
      value: stats.statistics.new_students,
      change: stats.payments.percentage_change_last_month,
      changeType: 'increase',
      iconBgColor: '#9C27B0'
    },
    {
      icon: <AssignmentIcon sx={{ color: '#fff' }} />,
      title: 'Completed Courses',
      value: stats.statistics.completed_courses,
      change: stats.payments.percentage_change_last_week,
      changeType: 'increase',
      iconBgColor: '#009688'
    },
    {
      icon: <QuizIcon sx={{ color: '#fff' }} />,
      title: 'Instructors',
      value: stats.statistics.course_instructors,
      change: stats.payments.percentage_change_yesterday,
      changeType: stats.payments.percentage_change_yesterday.includes('Down') ? 'decrease' : 'increase',
      iconBgColor: '#795548'
    },
    {
      icon: <BarChartIcon sx={{ color: '#fff' }} />,
      title: 'Active Courses',
      value: stats.statistics.active_courses,
      change: stats.payments.percentage_change_yesterday_payment,
      changeType: 'increase',
      iconBgColor: '#607D8B'
    }
  ];

  // فصل الأنشطة المالية عن الأنشطة الأخرى
  const financialActivities = stats.recent_activity.filter(activity => activity.amount);
  const systemHealthActivities = stats.recent_activity.filter(activity => !activity.amount);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Admin Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        {adminStatsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}

        {/* الرسم البياني الجديد للمبيعات */}
        <Grid item xs={12} md={12}>
          <SalesDetailChart data={stats} />
        </Grid>

        {/* الرسم البياني الأصلي */}
        <Grid item xs={12} md={12}>
          <PaymentGraph data={stats} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: '12px' }}>
            <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {financialActivities.map((activity, index) => {
                const isPositive = activity.amount.startsWith('+');
                return (
                  <li key={index} style={{ marginBottom: 16 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 4, backgroundColor: isPositive ? '#dcfaf8' : '#ffebee', color: isPositive ? '#2e7d32' : '#c62828', width: 40, height: 40, borderRadius: '50%' }}>
                          <i className="fa-solid fa-sack-dollar m-auto" style={{ fontSize: 18 }}></i>
                        </Box>
                        <Box>
                          <Typography variant="body1">{activity.activity}</Typography>
                          <Typography variant="caption" color="textSecondary">{activity.date}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" color={isPositive ? 'success.main' : 'error.main'}>
                        {activity.amount}
                      </Typography>
                    </Box>
                  </li>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: '12px' }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {systemHealthActivities.map((activity, index) => (
                <li key={index} style={{ marginBottom: 16 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 4 }}>
                        <i className="fa-regular fa-comment m-auto" style={{ fontSize: 24, color: '#424242' }}></i>
                      </Box>
                      <Box>
                        <Typography variant="body1">{activity.activity}</Typography>
                        <Typography variant="caption" color="textSecondary">{activity.date}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" color="textSecondary">5 stars</Typography>
                  </Box>
                </li>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* قسم الكورسات المميزة - Best Seller */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px', mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
              Best Seller
            </Typography>
            <Grid container spacing={3}>
              {stats.featured_courses.map((course, index) => {
                // تحديد الصورة بناءًا على اسم الكورس
                const courseImages = {
                  'Back-End Course': 'https://placehold.co/300x160/673AB7/FFFFFF/png?text=Back-End+Development',
                  'Network Course': 'https://placehold.co/300x160/2196F3/FFFFFF/png?text=Computer+Networking',
                  'AI Course': 'https://placehold.co/300x160/FF9800/FFFFFF/png?text=AI+Course'
                };

                // إنشاء نجوم التقييم
                const stars = Array(5).fill().map((_, i) => (
                  <span key={i} style={{ color: i < Math.floor(course.rating) ? '#FFC107' : '#e0e0e0', fontSize: '18px' }}>★</span>
                ));

                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{
                      border: '1px solid #eaeaea',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                      }
                    }}>
                      <Box sx={{ height: 160, overflow: 'hidden' }}>
                        <img
                          src={courseImages[course.course_name] || 'https://placehold.co/300x160/9C27B0/FFFFFF/png?text=Course'}
                          alt={course.course_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                          {stars}
                          <Typography variant="body2" sx={{ ml: 1, color: '#757575' }}>({course.rating})</Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{course.course_name}</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          Beginner&apos;s Guide To Becoming A Professional Backend Developer
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 2 }}>
                              <i className="fas fa-book" style={{ marginRight: 5, fontSize: 14 }}></i>
                              <Typography variant="caption">Lesson {course.lesson_count}</Typography>
                            </Box>
                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 2 }}>
                              <i className="fas fa-clock" style={{ marginRight: 5, fontSize: 14 }}></i>
                              <Typography variant="caption">{course.duration}</Typography>
                            </Box>
                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                              <i className="fas fa-users" style={{ marginRight: 5, fontSize: 14 }}></i>
                              <Typography variant="caption">Students {course.students}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography component="span" sx={{ fontSize: "22px", color: 'black', mr: 1 }}>
                              {course.price}
                            </Typography>

                          </Box>

                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}