'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase } from '@/lib/supabase';
import { team } from '@/lib/team';

/* =========================================================
   TYPES
   ========================================================= */

type EventType =
  | 'Club'
  | 'Workshop'
  | 'Meeting'
  | 'Competition'
  | 'Social'
  | 'Deadline'
  | 'Hackathon'
  | 'Other';

type TaskStatus =
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'done';

type TaskChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

type Task = {
  id: string;
  title: string;
  category: string;
  assigneeId: number;
  dueDate: string;
  points: number;
  priority: string;
  status: TaskStatus;
  checklist: TaskChecklistItem[];
};

type Member = {
  id: number;
  name: string;
  role?: string;
  category?: string | string[];
  img?: string;
  github?: string;
  linkedin?: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  type: EventType;
};

/* =========================================================
   ADMIN CREDENTIALS
   CHANGE THESE
   ========================================================= */

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

/* =========================================================
   ADMIN CATEGORIES
   ========================================================= */

const ADMIN_TABS = [
 'ALL',
 'General',
 'Technical',
 'Activities',
 'Public Relations',
 'Media',
 'Executives',
];

/* =========================================================
   CALENDAR EVENTS
   ========================================================= */

const EVENTS: CalendarEvent[] = [
  {
    id: 'club-fair',
    title: 'IoT Club Fair',
    date: '2026-09-15',
    endDate: '2026-09-16',
    startTime: '10:00',
    endTime: '16:00',
    location: 'Main Building Rotunda',
    description:
 'Come visit the IoT Club booth for interactive challenges, robots, trivia, prizes, and more.',
    type: 'Club',
  },

  /*{
    id: 'Besomi TinyML workshop',
    title: 'Besomi TinyML Workshop',
    date: '2026-10-12',
    startTime: '17:00',
    endTime: '19:00',
    location: 'ESB-1043',
    description:
 'Hands-on IoT workshop for club members.',
    type: 'Workshop',
  },

  */
  {
    id: "INSPIRE '26 Collab",
    title: "INSPIRE '26 Collab",
    date: '2026-09-05',
    startTime: '09:00',
    endTime: '19:00',
    location: 'Main Building',
    description:
 'Collaboration with IEEE SSCS in "INSPIRE 26 ',
    type: 'Hackathon',
  },

  {
    id: 'carnival-1',
    title: 'CARNIVAL',
    date: '2026-11-18',
    startTime: '15:00',
    endTime: '19:00',
    location: 'Football Field',
    description:
 'Collaboration between different clubs',
    type: 'Social',
  },

  {
    id: 'carnival-2',
    title: 'CARNIVAL',
    date: '2026-11-19',
    startTime: '15:00',
    endTime: '19:00',
    location: 'Football Field',
    description:
 'Collaboration between different clubs',
    type: 'Social',
  },
/*
  {
    id: 'Keychain Workshop',
    title: 'Make your own interactive Keychain',
    date: '2026-10-20',
    startTime: '16:00',
    endTime: '18:00',
    location: 'ESB',
    description:
 'Hands-on IoT workshop for club members.',
    type: 'Workshop',
  },
*/
  {
    id: 'Hackathon',
    title: 'Hackathon',
    date: '2026-11-01',
    startTime: '09:00',
    endTime: '18:00',
    location: 'Main Bldg',
    description:
 'hackathon event',
    type: 'Competition',
  },
  
  {
    id: 'Movie Night',
    title: 'IoT: Across the spiderverse',
    date: '2026-10-26',
    startTime: '016:00',
    endTime: '18:00',
    location: 'Floating theatre',
    description:
      '🕷️ An exciting movie night with the IoT community! Join us for a screening of *Spider-Man: Across the Spider-Verse* ',
    type: 'Social',
  },
];

/* =========================================================
   BLACKOUT DATES
   ========================================================= */

const BLACKOUT_DATES = [
  { date: '2026-11-24', title: 'NO CLUB ACTIVITIES' },
  { date: '2026-11-25', title: 'NO CLUB ACTIVITIES' },
  { date: '2026-11-26', title: 'NO CLUB ACTIVITIES' },
  { date: '2026-10-06', title: 'NO CLUB ACTIVITIES' },
  { date: '2026-10-13', title: 'NO CLUB ACTIVITIES' },
  { date: '2026-10-22', title: 'NO CLUB ACTIVITIES' },
  { date: '2026-10-14', title: 'NO CLUB ACTIVITIES' },
];

/* =========================================================
   HELPERS
   ========================================================= */

function getDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getTodayKey() {
  return getDateKey(new Date());
}

function getBlackoutDate(
  dateKey: string
) {
  return BLACKOUT_DATES.find(
    (item) => item.date === dateKey
  );
}

function formatDate(
  dateString?: string | null
) {
  if (!dateString) {
    return 'No date';
  }

  const date = new Date(
 `${dateString}T00:00:00`
  );

  return date.toLocaleDateString(
 'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );
}

function formatTime(
  time?: string | null
) {
  if (!time) return '';

  const [hours, minutes] =
    time.split(':');

  const hour = Number(hours);

  const suffix =
    hour >= 12 ? 'PM' : 'AM';

  const displayHour =
    hour % 12 || 12;

  return `${displayHour}:${minutes} ${suffix}`;
}

function getEventColor(
  type: EventType
) {
  switch (type) {
    case 'Workshop':
      return 'bg-accent/15 border-accent/30 text-accent';

    case 'Meeting':
      return 'bg-surface-2 border-control text-text';

    case 'Competition':
      return 'bg-ember/15 border-ember/30 text-ember';

    case 'Social':
      return 'bg-surface-2 border-control text-muted';

    case 'Deadline':
      return 'bg-danger/10 border-danger/30 text-danger';

    case 'Club':
      return 'bg-text/10 border-text/30 text-text';

    default:
      return 'bg-surface-2 border-control text-text';
  }
}

function getPriorityColor(
  priority?: string | null
) {
  switch (
    priority?.toLowerCase()
  ) {
    case 'high':
      return 'text-danger bg-danger/10 border-danger/30';

    case 'medium':
      return 'text-ember bg-ember/10 border-ember/20';

    case 'low':
      return 'text-accent bg-accent/10 border-accent/30';

    default:
      return 'text-muted bg-surface-2 border-control';
  }
}

function getTaskStatusLabel(
  status: TaskStatus
) {
  switch (status) {
    case 'todo':
      return 'To Do';

    case 'in_progress':
      return 'In Progress';

    case 'review':
      return 'Review';

    case 'done':
      return 'Done';

    default:
      return status;
  }
}

/* =========================================================
   PAGE
   ========================================================= */

export default function HomePage() {
  /* =======================================================
     VIEW
     ======================================================= */

  const [view, setView] =
    useState<'calendar' | 'tasks'>(
 'calendar'
    );

  /* =======================================================
     ADMIN
     ======================================================= */

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [showLogin, setShowLogin] =
    useState(false);

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loginError, setLoginError] =
    useState('');

  /* =======================================================
     TASKS
     ======================================================= */

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [
    selectedAdminTab,
    setSelectedAdminTab,
  ] = useState('ALL');

  const [
    showCreateTask,
    setShowCreateTask,
  ] = useState(false);

  /* =======================================================
     CALENDAR
     ======================================================= */

  const today = new Date();

  const [
    currentDate,
    setCurrentDate,
  ] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
  );

  const [
    selectedEvent,
    setSelectedEvent,
  ] =
    useState<CalendarEvent | null>(
      null
    );

  /* =======================================================
     CREATE TASK FORM
     ======================================================= */

  const [
    newTaskTitle,
    setNewTaskTitle,
  ] = useState('');

  const [
    newTaskCategory,
    setNewTaskCategory,
  ] = useState('General');

  const [
    newTaskAssignee,
    setNewTaskAssignee,
  ] = useState('');

  const [
    newTaskDueDate,
    setNewTaskDueDate,
  ] = useState('');

  const [
    newTaskPoints,
    setNewTaskPoints,
  ] = useState('10');

  const [
    newTaskPriority,
    setNewTaskPriority,
  ] = useState('Medium');

  const [
    newTaskChecklist,
    setNewTaskChecklist,
  ] = useState('');

  /* =======================================================
     MEMBERS
     ======================================================= */

  const validMembers =
    useMemo(
      () =>
        (team as Member[]).filter(
          (member) =>
            member.name.trim()
              .length > 0
        ),
      []
    );

  /* =======================================================
     LOAD ADMIN STATE
     ======================================================= */

  useEffect(() => {
    const savedAdmin =
      localStorage.getItem(
 'iot_admin_logged_in'
      );

    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  /* =======================================================
     FETCH TASKS
     ======================================================= */

  const fetchTasks =
    useCallback(async () => {
      const {
        data,
        error,
      } = await supabase
        .from('tasks')
        .select('*')
        .order(
 'dueDate',
          {
            ascending: true,
          }
        );

      if (error) {
        console.error(
 'Error loading tasks:',
          error
        );

        return;
      }

      setTasks(
        (data as Task[]) || []
      );
    }, []);

  /* =======================================================
     REALTIME
     ======================================================= */

  useEffect(() => {
    fetchTasks();

    const channel =
      supabase
        .channel(
 'public-task-sync'
        )
        .on(
 'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
          },
          () => {
            fetchTasks();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [fetchTasks]);

  /* =======================================================
     LOGIN
     ======================================================= */

  function handleAdminLogin() {
    if (
      username ===
        ADMIN_USERNAME &&
      password ===
        ADMIN_PASSWORD
    ) {
      setIsAdmin(true);

      localStorage.setItem(
 'iot_admin_logged_in',
 'true'
      );

      setUsername('');
      setPassword('');
      setLoginError('');
      setShowLogin(false);

      return;
    }

    setLoginError(
 'Invalid username or password.'
    );
  }

  /* =======================================================
     LOGOUT
     ======================================================= */

  function handleAdminLogout() {
    setIsAdmin(false);

    localStorage.removeItem(
 'iot_admin_logged_in'
    );

    setShowLogin(false);
  }

  /* =======================================================
     MEMBER LOOKUP
     ======================================================= */

  function getMember(
    memberId?: number | string | null
  ) {
    if (
      memberId === undefined ||
      memberId === null
    ) {
      return undefined;
    }

    const numericId =
      Number(memberId);

    if (
      Number.isNaN(
        numericId
      )
    ) {
      return undefined;
    }

    return validMembers.find(
      (member) =>
        member.id ===
        numericId
    );
  }

  /* =======================================================
     AVATAR
     ======================================================= */

  function getAvatar(
    member?: Member
  ) {
    if (
      member?.img &&
      member.img.trim()
        .length > 1 &&
      member.img !==
 '/team/default_0.webp'
    ) {
      return member.img;
    }

    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${
      member?.name || 'IoT'
    }`;
  }

  /* =======================================================
     CHECKLIST TOGGLE
     ======================================================= */

  async function toggleChecklist(
    taskId: string,
    checkId: string
  ) {
    const task =
      tasks.find(
        (item) =>
          item.id === taskId
      );

    if (!task) return;

    const updatedChecklist =
      task.checklist.map(
        (item) =>
          item.id === checkId
            ? {
                ...item,
                completed:
                  !item.completed,
              }
            : item
      );

    setTasks((previous) =>
      previous.map((item) =>
        item.id === taskId
          ? {
              ...item,
              checklist:
                updatedChecklist,
            }
          : item
      )
    );

    const { error } =
      await supabase
        .from('tasks')
        .update({
          checklist:
            updatedChecklist,
        })
        .eq(
 'id',
          taskId
        );

    if (error) {
      console.error(
        error
      );

      fetchTasks();
    }
  }

  /* =======================================================
     SUBMIT
     ======================================================= */

  async function submitForApproval(
    taskId: string
  ) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: 'review',
            }
          : task
      )
    );

    const { error } =
      await supabase
        .from('tasks')
        .update({
          status: 'review',
        })
        .eq(
 'id',
          taskId
        );

    if (error) {
      fetchTasks();
    }
  }

  /* =======================================================
     APPROVE
     ======================================================= */

  async function approveTask(
    taskId: string
  ) {
    if (!isAdmin) return;

    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: 'done',
            }
          : task
      )
    );

    const { error } =
      await supabase
        .from('tasks')
        .update({
          status: 'done',
        })
        .eq(
 'id',
          taskId
        );

    if (error) {
      fetchTasks();
    }
  }

  /* =======================================================
     REJECT / REOPEN
     ======================================================= */

  async function rejectTask(
    taskId: string
  ) {
    if (!isAdmin) return;

    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: 'todo',
            }
          : task
      )
    );

    const { error } =
      await supabase
        .from('tasks')
        .update({
          status: 'todo',
        })
        .eq(
 'id',
          taskId
        );

    if (error) {
      fetchTasks();
    }
  }

  /* =======================================================
     DELETE
     ======================================================= */

  async function deleteTask(
    taskId: string
  ) {
    if (!isAdmin) return;

    setTasks((previous) =>
      previous.filter(
        (task) =>
          task.id !== taskId
      )
    );

    const { error } =
      await supabase
        .from('tasks')
        .delete()
        .eq(
 'id',
          taskId
        );

    if (error) {
      fetchTasks();
    }
  }

  /* =======================================================
     CREATE TASK
     ======================================================= */

  async function createTask() {
    if (!isAdmin) {
      return;
    }

    if (
      !newTaskTitle.trim()
    ) {
      return;
    }

    if (!newTaskAssignee) {
      return;
    }

    const checklist =
      newTaskChecklist
        .split(',')
        .map((item) =>
          item.trim()
        )
        .filter(
          (item) =>
            item.length > 0
        )
        .map(
          (
            text,
            index
          ) => ({
            id: `c_${Date.now()}_${index}`,
            text,
            completed: false,
          })
        );

    const newTask: Task = {
      id:
        typeof crypto !==
 'undefined' &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `task_${Date.now()}`,

      title:
        newTaskTitle.trim(),

      category:
        newTaskCategory,

      assigneeId:
        Number(
          newTaskAssignee
        ),

      dueDate:
        newTaskDueDate,

      points:
        Number(
          newTaskPoints
        ) || 0,

      priority:
        newTaskPriority,

      status: 'todo',

      checklist,
    };

    const { error } =
      await supabase
        .from('tasks')
        .insert([
          newTask,
        ]);

    if (error) {
      console.error(
 'Error creating task:',
        error
      );

      return;
    }

    setTasks((previous) => [
      ...previous,
      newTask,
    ]);

    /* Reset form */

    setNewTaskTitle('');
    setNewTaskCategory(
 'General'
    );
    setNewTaskAssignee('');
    setNewTaskDueDate('');
    setNewTaskPoints('10');
    setNewTaskPriority(
 'Medium'
    );
    setNewTaskChecklist('');

    setShowCreateTask(
      false
    );
  }

  /* =======================================================
     FILTERED TASKS
     ======================================================= */

  const visibleTasks =
    useMemo(() => {
      if (!isAdmin) {
        return tasks;
      }

      if (
        selectedAdminTab ===
 'ALL'
      ) {
        return tasks;
      }

      return tasks.filter(
        (task) =>
          task.category ===
          selectedAdminTab
      );
    }, [
      tasks,
      isAdmin,
      selectedAdminTab,
    ]);

  /* =======================================================
     TASK GROUPS
     ======================================================= */

  const activeTasks =
    useMemo(
      () =>
        visibleTasks.filter(
          (task) =>
            task.status ===
 'todo' ||
            task.status ===
 'in_progress'
        ),
      [visibleTasks]
    );

  const pendingReviewTasks =
    useMemo(
      () =>
        visibleTasks.filter(
          (task) =>
            task.status ===
 'review'
        ),
      [visibleTasks]
    );

  const completedTasks =
    useMemo(
      () =>
        visibleTasks.filter(
          (task) =>
            task.status ===
 'done'
        ),
      [visibleTasks]
    );

  /* =======================================================
     LEADERBOARD
     ======================================================= */

  const leaderboard =
    useMemo(() => {
      return validMembers
        .map((member) => {
          const doneTasks =
            tasks.filter(
              (task) =>
                task.assigneeId ===
                  member.id &&
                task.status ===
 'done'
            );

          const totalPoints =
            doneTasks.reduce(
              (
                total,
                task
              ) =>
                total +
                Number(
                  task.points ||
                    0
                ),
              0
            );

          return {
            ...member,
            totalPoints,
            doneCount:
              doneTasks.length,
          };
        })
        .sort(
          (a, b) =>
            b.totalPoints -
            a.totalPoints
        );
    }, [
      validMembers,
      tasks,
    ]);

  /* =======================================================
     CALENDAR DAYS
     ======================================================= */

  const calendarDays =
    useMemo(() => {
      const year =
        currentDate.getFullYear();

      const month =
        currentDate.getMonth();

      const firstDay =
        new Date(
          year,
          month,
          1
        );

      const startDay =
        firstDay.getDay();

      const daysInMonth =
        new Date(
          year,
          month + 1,
          0
        ).getDate();

      const previousMonthDays =
        new Date(
          year,
          month,
          0
        ).getDate();

      const days: {
        date: Date;
        isCurrentMonth: boolean;
      }[] = [];

      for (
        let i =
          startDay - 1;
        i >= 0;
        i--
      ) {
        days.push({
          date: new Date(
            year,
            month - 1,
            previousMonthDays -
              i
          ),
          isCurrentMonth:
            false,
        });
      }

      for (
        let day = 1;
        day <=
        daysInMonth;
        day++
      ) {
        days.push({
          date: new Date(
            year,
            month,
            day
          ),
          isCurrentMonth:
            true,
        });
      }

      while (
        days.length < 42
      ) {
        const dayOffset =
          days.length -
          (startDay +
            daysInMonth) +
          1;

        days.push({
          date: new Date(
            year,
            month + 1,
            dayOffset
          ),
          isCurrentMonth:
            false,
        });
      }

      return days;
    }, [currentDate]);

  const monthTitle =
    currentDate.toLocaleDateString(
 'en-US',
      {
        month: 'long',
        year: 'numeric',
      }
    );

  /* =======================================================
     CALENDAR EVENTS
     ======================================================= */

  function getEventsForDate(
    date: Date
  ) {
    const dateKey =
      getDateKey(date);

    return EVENTS.filter(
      (event) => {
        if (!event.endDate) {
          return (
            event.date ===
            dateKey
          );
        }

        return (
          dateKey >=
            event.date &&
          dateKey <=
            event.endDate
        );
      }
    );
  }

  function goToPreviousMonth() {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() -
          1,
        1
      )
    );
  }

  function goToNextMonth() {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() +
          1,
        1
      )
    );
  }

  function goToToday() {
    const now =
      new Date();

    setCurrentDate(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
    );
  }

  const todayKeyForHero = getTodayKey();
  const upcomingEvents = [...EVENTS]
    .filter((event) => (event.endDate ?? event.date) >= todayKeyForHero)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  /* =======================================================
     RENDER
     ======================================================= */

  return (

    
<main className="min-h-screen bg-bg text-text">
      {/* HERO: the next events from the club calendar, as large dates */}
      <section aria-labelledby="tasks-title" className="mx-auto max-w-[1600px] px-3 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <h1 id="tasks-title" className="text-[clamp(56px,11vw,168px)] leading-[0.9] text-text">
          Calendar and tasks
        </h1>
        {upcomingEvents.length > 0 && (
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <p className="font-display text-[clamp(88px,13vw,200px)] font-extrabold leading-[0.85] text-ember">
                  {Number(event.date.slice(8, 10))}
                </p>
                <p className="mt-2 text-[16px] text-muted">
                  {MONTH_NAMES[Number(event.date.slice(5, 7)) - 1]} {event.date.slice(0, 4)}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className="mt-2 text-left font-display text-[clamp(28px,3vw,44px)] font-extrabold uppercase leading-[1] text-text hover:text-accent"
                >
                  {event.title}
                </button>
              </li>
            ))}
          </ol>
        )}
      </section>
      {/* =====================================================
    CALENDAR / TASK CONTROLS
    ===================================================== */}

<div className="border-b border-divider bg-bg px-3 py-3 sm:px-6 lg:px-8">
  <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">

    {/* Left side */}
    <div className="flex items-center gap-2">

      <button
        onClick={() => setView('calendar')}
        className={`rounded-none border px-3 py-2 text-[14px] font-semibold transition sm:px-4 sm:text-[16px] ${
          view === 'calendar'
            ? 'border-accent/40 bg-accent/10 text-accent'
            : 'border-divider bg-surface text-text hover:border-accent/50 hover:text-text'
        }`}
      >
        Calendar
      </button>

      <button
        onClick={() => setView('tasks')}
        className={`rounded-none border px-3 py-2 text-[14px] font-semibold transition sm:px-4 sm:text-[16px] ${
          view === 'tasks'
            ? 'border-accent/40 bg-accent/10 text-accent'
            : 'border-divider bg-surface text-text hover:border-accent/50 hover:text-text'
        }`}
      >
        Tasks
      </button>

    </div>

    {/* Right side */}
    <div>

      {isAdmin ? (
        <button
          onClick={handleAdminLogout}
          className="rounded-none border border-danger/30 bg-danger/10 px-3 py-2 text-[14px] font-semibold text-danger transition hover:bg-danger/10 sm:px-4 sm:text-[16px]"
        >
          Admin Sign Out
        </button>
      ) : (
        <button
          onClick={() => {
            setShowLogin(true);
            setView('tasks');
          }}
          className="rounded-none border border-divider bg-surface px-3 py-2 text-[14px] font-semibold text-text transition hover:border-accent/50 hover:text-text sm:px-4 sm:text-[16px]"
        >
          Admin Sign In
        </button>
      )}

    </div>

  </div>
</div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6 lg:px-8 lg:py-6">

        {/* ===================================================
            CALENDAR
            =================================================== */}

        {view ===
 'calendar' && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">

            <section className="min-w-0 overflow-hidden rounded-none border border-divider bg-bg ">

              <div className="flex flex-col gap-3 border-b border-divider px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-[20px] font-bold sm:text-xl">
                    {monthTitle}
                  </h2>

                  <p className="mt-1 text-[16px] text-text0">
                    Club events,
                    workshops,
                    meetings, and
                    deadlines
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={
                      goToToday
                    }
                    className="rounded-none border border-divider bg-surface px-3 py-2 text-[14px] font-semibold text-text transition hover:border-accent/50 hover:text-text"
                  >
                    Today
                  </button>

                  <button
                    onClick={
                      goToPreviousMonth
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-none border border-divider bg-surface text-text transition hover:border-accent/50 hover:text-text"
                  >
                    ←
                  </button>

                  <button
                    onClick={
                      goToNextMonth
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-none border border-divider bg-surface text-text transition hover:border-accent/50 hover:text-text"
                  >
                    →
                  </button>

                </div>

              </div>

              <div className="hidden grid-cols-7 border-b border-divider md:grid">

                {[
 'Sun',
 'Mon',
 'Tue',
 'Wed',
 'Thu',
 'Fri',
 'Sat',
                ].map(
                  (day) => (
                    <div
                      key={day}
                      className="border-r border-divider px-1 py-2 text-center text-[14px] font-bold uppercase tracking-wider text-text0 last:border-r-0 sm:text-[14px]"
                    >
                      {day}
                    </div>
                  )
                )}

              </div>

              <div className="hidden grid-cols-7 md:grid">

                {calendarDays.map(
                  (
                    {
                      date,
                      isCurrentMonth,
                    },
                    index
                  ) => {
                    const dateKey =
                      getDateKey(
                        date
                      );

                    const isToday =
                      dateKey ===
                      getTodayKey();

                    const blackout =
                      getBlackoutDate(
                        dateKey
                      );

                    const events =
                      getEventsForDate(
                        date
                      );

                    return (
                      <div
                        key={`${dateKey}-${index}`}
                        className={`
                          relative min-h-[78px]
                          border-r border-b p-1
                          transition
                          sm:min-h-[92px]
                          lg:min-h-[105px]

                          ${
                            blackout
                              ? 'border-danger/30 bg-danger/10'
                              : isCurrentMonth
                              ? 'border-divider bg-bg'
                              : 'border-divider bg-bg'
                          }

                          ${
                            isToday &&
                            !blackout
                              ? 'bg-surface-2'
                              : ''
                          }
 `}
                      >

                        <div className="mb-1 flex items-center justify-between">

                          <span
                            className={`
                              flex h-6 w-6 items-center justify-center
                              rounded-none text-[14px] font-semibold

                              ${
                                isToday &&
                                !blackout
                                  ? 'bg-accent text-on-accent'
                                  : blackout
                                  ? 'text-danger'
                                  : isCurrentMonth
                                  ? 'text-text'
                                  : 'text-muted/60'
                              }
 `}
                          >
                            {date.getDate()}
                          </span>

                          {isToday &&
                            !blackout && (
                              <span className="hidden text-[14px] font-bold uppercase tracking-wider text-accent sm:block">
                                Today
                              </span>
                            )}

                        </div>

                        {blackout && (
                          <div className="mb-1 rounded-none border border-danger/30 bg-danger/10 px-1 py-1">
                            <p className="break-words text-[16px] font-bold uppercase tracking-wide text-danger">
                              {
                                blackout.title
                              }
                            </p>
                          </div>
                        )}

                        <div className="space-y-1">

                          {events
                            .slice(
                              0,
                              3
                            )
                            .map(
                              (
                                event
                              ) => (
                                <button
                                  key={
                                    event.id
                                  }
                                  onClick={() =>
                                    setSelectedEvent(
                                      event
                                    )
                                  }
                                  className={`
                                    block w-full break-words rounded-none
                                    border px-1 py-1 text-left
                                    text-[14px] font-semibold
                                    transition sm:text-[14px]

                                    ${getEventColor(
                                      event.type
                                    )}
 `}
                                >
                                  {
                                    event.title
                                  }
                                </button>
                              )
                            )}

                          {events.length >
                            3 && (
                            <p className="px-1 text-[16px] text-text0">
                              +
                              {events.length -
                                3}{' '}
                              more
                            </p>
                          )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

              {/* Agenda: the month as a list, for narrow screens */}
              <div className="md:hidden">
                {calendarDays.filter(({ isCurrentMonth }) => isCurrentMonth).map(({ date }) => {
                  const key = getDateKey(date);
                  const dayEvents = getEventsForDate(date);
                  const closed = getBlackoutDate(key);
                  if (dayEvents.length === 0 && !closed) return null;
                  return (
                    <div key={key} className="border-b border-divider px-4 py-4">
                      <p className="text-[16px] font-semibold text-text">
                        {date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                      {closed && <p className="mt-2 text-[16px] font-semibold text-danger">{closed.title}</p>}
                      <div className="mt-2 flex flex-col gap-2">
                        {dayEvents.map((event) => (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => setSelectedEvent(event)}
                            className={`block w-full break-words border px-3 py-3 text-left text-[16px] font-semibold ${getEventColor(event.type)}`}
                          >
                            {event.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-divider px-4 py-3">

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-none bg-accent" />
                  <span className="text-[14px] text-text0">
                    Today
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-none bg-danger" />
                  <span className="text-[14px] text-text0">
                    No Club
                    Activities
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-none bg-accent" />
                  <span className="text-[14px] text-text0">
                    Workshop
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-none bg-text" />
                  <span className="text-[14px] text-text0">
                    Meeting
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-none bg-ember" />
                  <span className="text-[14px] text-text0">
                    Competition
                  </span>
                </div>

              </div>

            </section>

            {/* =================================================
                LIVE TASKS
                ================================================= */}

            <aside className="h-fit rounded-none border border-divider bg-bg">

              <div className="flex items-center justify-between border-b border-divider px-4 py-4">

                <div>
                  <h2 className="text-[16px] font-bold">
                    Live Tasks
                  </h2>

                  <p className="mt-1 text-[16px] text-text0">
                    Current club
                    tasks
                  </p>
                </div>

                <button
                  onClick={() =>
                    setView(
 'tasks'
                    )
                  }
                  className="text-[14px] font-semibold text-accent hover:text-accent"
                >
                  View all
                </button>

              </div>

              <div className="p-3">

                {activeTasks.length ===
                0 ? (
                  <div className="rounded-none border border-dashed border-divider px-4 py-8 text-center">

                    <p className="text-[16px] font-semibold text-muted">
                      No active
                      tasks
                    </p>

                    <p className="mt-1 text-[16px] text-muted">
                      Everything is
                      currently
                      completed.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-2">

                    {activeTasks
                      .slice(
                        0,
                        7
                      )
                      .map(
                        (task) => {
                          const assignee =
                            getMember(
                              task.assigneeId
                            );

                          return (
                            <button
                              key={
                                task.id
                              }
                              onClick={() =>
                                setView(
 'tasks'
                                )
                              }
                              className="block w-full rounded-none border border-divider bg-surface p-3 text-left transition hover:border-accent/30 hover:bg-surface"
                            >

                              <div className="flex items-start justify-between gap-2">

                                <p className="line-clamp-2 text-[16px] font-semibold text-text">
                                  {
                                    task.title
                                  }
                                </p>

                                <span className="shrink-0 text-[14px] font-bold text-accent">
                                  +
                                  {
                                    task.points
                                  }
                                </span>

                              </div>

                              <div className="mt-2 flex flex-wrap gap-1">

                                <span className="rounded-none border border-divider bg-bg px-1.5 py-0.5 text-[14px] font-semibold text-muted">
                                  {
                                    task.category
                                  }
                                </span>

                                <span
                                  className={`
                                    rounded-none border px-1.5 py-0.5
                                    text-[14px] font-semibold
                                    ${getPriorityColor(
                                      task.priority
                                    )}
 `}
                                >
                                  {
                                    task.priority
                                  }
                                </span>

                              </div>

                              <div className="mt-2 flex items-center justify-between gap-2">

                                <span className="truncate text-[14px] text-text0">
                                  {assignee?.name ||
 'Unassigned'}
                                </span>

                                <span className="shrink-0 text-[14px] text-muted">
                                  {task.dueDate
                                    ? formatDate(
                                        task.dueDate
                                      )
                                    : 'No due date'}
                                </span>

                              </div>

                              <div className="mt-2">
                                <span className="text-[14px] font-semibold uppercase tracking-wider text-muted">
                                  {
                                    getTaskStatusLabel(
                                      task.status
                                    )
                                  }
                                </span>
                              </div>

                            </button>
                          );
                        }
                      )}

                  </div>
                )}

              </div>

              <div className="border-t border-divider px-4 py-3">

                <button
                  onClick={() =>
                    setView(
 'tasks'
                    )
                  }
                  className="block w-full rounded-none border border-divider bg-surface px-3 py-2 text-center text-[14px] font-semibold text-muted transition hover:border-accent/30 hover:text-accent"
                >
                  Open Task
                  Manager
                </button>

              </div>

            </aside>

          </div>
        )}

        {/* ===================================================
            TASK MANAGER
            =================================================== */}

        {view === 'tasks' && (
          <div className="min-h-screen">

            {/* =================================================
                TASK HEADER
                ================================================= */}

            <div className="mb-6 border-b border-divider pb-5">

              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">

                <div>

                  <div className="mb-2 flex flex-wrap items-center gap-2">

                    <span className="rounded-none border border-accent bg-surface-2 px-2 py-0.5 text-[14px] font-bold uppercase tracking-widest text-accent">
                      Public Task
                      Portal
                    </span>

                    {isAdmin && (
                      <span className="rounded-none border border-ember/40 bg-surface-2 px-2 py-0.5 text-[14px] font-bold uppercase text-ember">
                        Admin Mode
                      </span>
                    )}

                  </div>

                  <h1 className="text-2xl font-extrabold text-text">
                    Club Task Manager
                  </h1>

                  <p className="mt-1 text-[16px] text-text0">
                    All club members can
                    view and work on
                    tasks.
                  </p>

                </div>

                <div className="flex items-center gap-2">

                  {isAdmin && (
                    <button
                      onClick={() =>
                        setShowCreateTask(
                          true
                        )
                      }
                      className="rounded-none bg-accent px-4 py-2 text-[14px] font-medium text-on-accent   transition hover:opacity-90"
                    >
                      + Create Task
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setView(
 'calendar'
                      )
                    }
                    className="rounded-none border border-divider bg-surface-2 px-3 py-2 text-[14px] text-text transition hover:bg-surface-2"
                  >
                    Calendar
                  </button>

                </div>

              </div>

            </div>

            {/* =================================================
                ADMIN FILTERS
                ================================================= */}

            {isAdmin && (
              <div className="mb-6 flex flex-wrap gap-2 border-b border-divider pb-4">

                <span className="mr-2 self-center text-[14px] font-semibold text-muted">
                  Filter View:
                </span>

                {ADMIN_TABS.map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() =>
                        setSelectedAdminTab(
                          tab
                        )
                      }
                      className={`
                        rounded-none border px-3 py-1.5
                        text-[14px] transition

                        ${
                          selectedAdminTab ===
                          tab
                            ? 'border-accent bg-accent font-semibold text-on-accent'
                            : 'border-divider bg-surface text-muted hover:border-divider'
                        }
 `}
                    >
                      {tab}
                    </button>
                  )
                )}

              </div>
            )}

            {/* =================================================
                TASK GRID
                ================================================= */}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

              <div className="space-y-8 lg:col-span-2">

                {/* =================================================
                    PENDING
                    ================================================= */}

                {pendingReviewTasks.length >
                  0 && (
                  <section className="space-y-4 rounded-none border border-ember/50 bg-ember/20 p-4">

                    <h2 className="flex items-center justify-between text-[16px] font-bold uppercase tracking-wider text-ember">

                      <span>
                        Pending Admin
                        Approval (
                        {
                          pendingReviewTasks.length
                        }
                        )
                      </span>

                      <span className="text-[14px] font-normal normal-case text-ember/80">
                        Points awarded
                        upon approval
                      </span>

                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                      {pendingReviewTasks.map(
                        (task) => {
                          const assignee =
                            getMember(
                              task.assigneeId
                            );

                          return (
                            <div
                              key={
                                task.id
                              }
                              className="rounded-none border border-ember/60 bg-surface p-4"
                            >

                              <div className="mb-2 flex justify-between">

                                <span className="rounded-none border border-ember/40 bg-surface-2 px-2 py-0.5 text-[14px] uppercase text-ember">
                                  {
                                    task.category
                                  }{' '}
                                  • Review
                                </span>

                                <span className="text-[14px] font-bold text-ember">
                                  +
                                  {
                                    task.points
                                  }{' '}
                                  pts
                                </span>

                              </div>

                              <h3 className="text-[16px] font-semibold text-text">
                                {
                                  task.title
                                }
                              </h3>

                              <p className="mb-3 mt-1 text-[16px] text-muted">
                                Submitted by{' '}
                                {
                                  assignee?.name ||
 'Unknown'
                                }
                              </p>

                              <div className="mb-4 space-y-1">

                                {task.checklist.map(
                                  (
                                    item
                                  ) => (
                                    <div
                                      key={
                                        item.id
                                      }
                                      className="text-[14px] text-text"
                                    >
                                      ✓{' '}
                                      {
                                        item.text
                                      }
                                    </div>
                                  )
                                )}

                              </div>

                              {isAdmin && (
                                <div className="flex justify-end gap-2 border-t border-divider pt-3">

                                  <button
                                    onClick={() =>
                                      rejectTask(
                                        task.id
                                      )
                                    }
                                    className="rounded-none border border-danger/40 bg-danger/10 px-3 py-1.5 text-[14px] text-danger hover:bg-danger/10"
                                  >
                                    Reject
                                  </button>

                                  <button
                                    onClick={() =>
                                      approveTask(
                                        task.id
                                      )
                                    }
                                    className="rounded-none bg-accent px-3 py-1.5 text-[14px] font-bold text-on-accent hover:bg-accent"
                                  >
                                    Approve
                                  </button>

                                </div>
                              )}

                            </div>
                          );
                        }
                      )}

                    </div>

                  </section>
                )}

                {/* =================================================
                    ACTIVE
                    ================================================= */}

                <section className="space-y-4">

                  <h2 className="text-[16px] font-bold uppercase tracking-wider text-text">
                    Active Work (
                    {
                      activeTasks.length
                    }
                    )
                  </h2>

                  {activeTasks.length ===
                  0 ? (
                    <div className="rounded-none border border-divider bg-surface p-8 text-center text-[14px] text-text0">
                      No active tasks
                      pending.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                      {activeTasks.map(
                        (task) => {
                          const assignee =
                            getMember(
                              task.assigneeId
                            );

                          const allDone =
                            task.checklist.length >
                              0 &&
                            task.checklist.every(
                              (
                                item
                              ) =>
                                item.completed
                            );

                          return (
                            <div
                              key={
                                task.id
                              }
                              className="rounded-none border border-divider bg-surface p-4"
                            >

                              <div className="mb-3 flex items-center justify-between">

                                <span className="rounded-none border border-divider bg-surface-2 px-2 py-0.5 text-[14px] font-semibold uppercase text-accent">
                                  {
                                    task.category
                                  }
                                </span>

                                <div className="flex items-center gap-2">

                                  <span className="rounded-none border border-ember/50 bg-ember/40 px-2 py-0.5 text-[14px] font-bold text-ember">
                                    +
                                    {
                                      task.points
                                    }{' '}
                                    pts
                                  </span>

                                  {isAdmin && (
                                    <button
                                      onClick={() =>
                                        deleteTask(
                                          task.id
                                        )
                                      }
                                      className="text-[14px] text-text0 hover:text-danger"
                                    >
                                      ✕
                                    </button>
                                  )}

                                </div>

                              </div>

                              <h3 className="text-[16px] font-semibold text-text">
                                {
                                  task.title
                                }
                              </h3>

                              <div className="my-3 space-y-1.5">

                                {task.checklist.map(
                                  (
                                    item
                                  ) => (
                                    <label
                                      key={
                                        item.id
                                      }
                                      className="flex cursor-pointer items-start gap-2 text-[14px] text-text"
                                    >

                                      <input
                                        type="checkbox"
                                        checked={
                                          item.completed
                                        }
                                        onChange={() =>
                                          toggleChecklist(
                                            task.id,
                                            item.id
                                          )
                                        }
                                        className="mt-0.5 rounded-none border-divider bg-surface-2 text-accent focus:ring-0"
                                      />

                                      <span
                                        className={
                                          item.completed
                                            ? 'line-through text-text0'
                                            : ''
                                        }
                                      >
                                        {
                                          item.text
                                        }
                                      </span>

                                    </label>
                                  )
                                )}

                              </div>

                              <div className="flex items-center justify-between border-t border-divider pt-3">

                                <div className="flex items-center gap-2">

                                  <img
                                    src={getAvatar(
                                      assignee
                                    )}
                                    alt={
                                      assignee?.name ||
 'Member'
                                    }
                                    className="h-6 w-6 rounded-none bg-surface-2 object-cover"
                                  />

                                  <span className="max-w-[110px] truncate text-[14px] text-text">
                                    {
                                      assignee?.name
                                    }
                                  </span>

                                </div>

                                <button
                                  onClick={() =>
                                    submitForApproval(
                                      task.id
                                    )
                                  }
                                  className={`
                                    rounded-none border px-3 py-1.5
                                    text-[14px] font-bold transition

                                    ${
                                      allDone
                                        ? 'border-ember/40 bg-ember text-on-ember'
                                        : 'border-accent bg-surface-2 text-accent hover:opacity-90 hover:text-text'
                                    }
 `}
                                >
                                  Submit for
                                  Approval
                                </button>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                </section>

                {/* =================================================
                    COMPLETED
                    ================================================= */}

                {completedTasks.length >
                  0 && (
                  <section className="space-y-4 border-t border-divider pt-4">

                    <h2 className="text-[16px] font-bold uppercase tracking-wider text-accent">
                      Approved &
                      Completed (
                      {
                        completedTasks.length
                      }
                      )
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                      {completedTasks.map(
                        (task) => {
                          const assignee =
                            getMember(
                              task.assigneeId
                            );

                          return (
                            <div
                              key={
                                task.id
                              }
                              className="rounded-none border border-accent/30 bg-surface p-4"
                            >

                              <div className="flex justify-between">

                                <div>

                                  <span className="rounded-none border border-accent/30 bg-surface-2 px-2 py-0.5 text-[14px] text-accent">
                                    Approved
                                  </span>

                                  <h3 className="mt-2 text-[16px] text-text line-through">
                                    {
                                      task.title
                                    }
                                  </h3>

                                </div>

                                <span className="text-[14px] font-bold text-accent">
                                  +
                                  {
                                    task.points
                                  }{' '}
                                  pts
                                </span>

                              </div>

                              <div className="mt-3 flex items-center justify-between border-t border-divider pt-2">

                                <span className="text-[14px] text-muted">
                                  {
                                    assignee?.name
                                  }
                                </span>

                                {isAdmin && (
                                  <button
                                    onClick={() =>
                                      rejectTask(
                                        task.id
                                      )
                                    }
                                    className="text-[14px] text-text0 underline hover:text-text"
                                  >
                                    Re-open
                                  </button>
                                )}

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </section>
                )}

              </div>

              {/* =================================================
                  LEADERBOARD
                  ================================================= */}

              <aside>

                <h2 className="mb-4 text-[16px] font-bold uppercase tracking-wider text-text">
                  Live Leaderboard
                </h2>

                <div className="divide-y divide-divider rounded-none border border-divider bg-surface p-4">

                  {leaderboard.map(
                    (
                      member,
                      index
                    ) => (
                      <div
                        key={
                          member.id
                        }
                        className="flex items-center justify-between py-3"
                      >

                        <div className="flex items-center gap-3">

                          <span className="w-5 text-[14px] font-bold text-text0">
                            #
                            {index +
                              1}
                          </span>

                          <img
                            src={getAvatar(
                              member
                            )}
                            alt={
                              member.name
                            }
                            className="h-8 w-8 rounded-none bg-surface-2 object-cover"
                          />

                          <div>
                            <p className="text-[16px] font-semibold text-text">
                              {
                                member.name
                              }
                            </p>

                            <p className="text-[16px] text-text0">
                              {
                                member.role
                              }
                            </p>
                          </div>

                        </div>

                        <div className="text-right">

                          <p className="text-[16px] font-bold text-ember">
                            {
                              member.totalPoints
                            }{' '}
                            pts
                          </p>

                          <p className="text-[16px] text-text0">
                            {
                              member.doneCount
                            }{' '}
                            approved
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </aside>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          ADMIN LOGIN MODAL
          ===================================================== */}

      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 "
          onClick={() =>
            setShowLogin(false)
          }
        >

          <div
            className="w-full max-w-sm rounded-none border border-divider bg-bg p-6 "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="mb-6">

              <p className="text-[16px] font-bold uppercase tracking-[0.2em] text-accent">
                AUS IoT Club
              </p>

              <h2 className="mt-2 text-xl font-bold text-text">
                Admin Sign In
              </h2>

              <p className="mt-1 text-[16px] text-text0">
                Sign in to create and
                manage club tasks.
              </p>

            </div>

            <div className="space-y-4">

              <div>

                <label className="mb-1 block text-[14px] font-bold uppercase tracking-wider text-text0">
                  Username
                </label>

                <input
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
 'Enter'
                    ) {
                      handleAdminLogin();
                    }
                  }}
                  autoComplete="username"
                  className="w-full rounded-none border border-divider bg-surface px-3 py-2.5 text-[16px] text-text outline-none transition placeholder:text-muted focus:border-accent"
                  placeholder="Username"
                />

              </div>

              <div>

                <label className="mb-1 block text-[14px] font-bold uppercase tracking-wider text-text0">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
 'Enter'
                    ) {
                      handleAdminLogin();
                    }
                  }}
                  autoComplete="current-password"
                  className="w-full rounded-none border border-divider bg-surface px-3 py-2.5 text-[16px] text-text outline-none transition placeholder:text-muted focus:border-accent"
                  placeholder="Password"
                />

              </div>

              {loginError && (
                <div className="rounded-none border border-danger/30 bg-danger/10 px-3 py-2 text-[14px] text-danger">
                  {
                    loginError
                  }
                </div>
              )}

              <div className="flex gap-2 pt-2">

                <button
                  onClick={() =>
                    setShowLogin(
                      false
                    )
                  }
                  className="flex-1 rounded-none border border-divider bg-surface px-4 py-2.5 text-[14px] font-semibold text-muted transition hover:bg-surface-2"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleAdminLogin
                  }
                  className="flex-1 rounded-none bg-accent px-4 py-2.5 text-[14px] font-bold text-on-accent transition hover:opacity-90"
                >
                  Sign In
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          CREATE TASK MODAL
          ===================================================== */}

      {showCreateTask &&
        isAdmin && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 "
            onClick={() =>
              setShowCreateTask(
                false
              )
            }
          >

            <div
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-none border border-divider bg-bg p-6 "
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="mb-6 flex items-start justify-between">

                <div>

                  <p className="text-[16px] font-bold uppercase tracking-[0.2em] text-accent">
                    Admin
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-text">
                    Create Task
                  </h2>

                </div>

                <button
                  onClick={() =>
                    setShowCreateTask(
                      false
                    )
                  }
                  className="text-text0 hover:text-text"
                >
                  ×
                </button>

              </div>

              <div className="space-y-4">

                {/* Title */}

                <div>

                  <label className="mb-1 block text-[14px] font-bold uppercase tracking-wider text-text0">
                    Task Title
                  </label>

                  <input
                    value={
                      newTaskTitle
                    }
                    onChange={(event) =>
                      setNewTaskTitle(
                        event.target
                          .value
                      )
                    }
                    className="w-full rounded-none border border-divider bg-surface px-3 py-2.5 text-[16px] text-text outline-none focus:border-accent"
                    placeholder="e.g. Design Instagram post"
                  />

                </div>

                {/* Category */}

                <div>

                  <label className="mb-1 block text-[14px] font-bold uppercase tracking-wider text-text0">
                    Category
                  </label>

                  <select
                    value={
                      newTaskCategory
                    }
                    onChange={(event) =>
                      setNewTaskCategory(
                        event.target
                          .value
                      )
                    }
                    className="w-full rounded-none border border-divider bg-surface px-3 py-2.5 text-[16px] text-text outline-none focus:border-accent"
                  >

                    {ADMIN_TABS.filter(
                      (item) =>
                        item !==
 'ALL'
                    ).map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category
                          }
                          value={
                            category
                          }
                        >
                          {
                            category
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* Assignee */}

                <div>

                  <label className="mb-1 block text-[14px] font-bold uppercase tracking-wider text-text0">
                    Assign To
                  </label>

                  <select
                    value={
                      newTaskAssignee
                    }
                    onChange={(event) =>
                      setNewTaskAssignee(
                        event.target
                          .value
                      )
                    }
                    className="w-full rounded-none border border-divider bg-surface px-3 py-2.5 text-[16px] text-text outline-none focus:border-accent"
                  >

                    <option value="">
                      Select member
                    </option>

                    {validMembers.map(
                      (
                        member
                      ) => (
                        <option
                          key={
                            member.id
                          }
                          value={
                            member.id
                          }
                        >
                          {
                            member.name
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* Due date */}

                <div>

                  <label className="mb-1 block text-[14px] font-bold uppercase tracking-wider text-text0">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={
                      newTaskDueDate
                    }
                    onChange={(event) =>
                      setNewTaskDueDate(
                        event.target
                          .value
                      )
                    }
                    className="w-full rounded-none border border-divider bg-surface px-3 py-2.5 text-[16px] text-text outline-none focus:border-accent"
                  />

                </div>

                {/* Points / priority */}

                <div className="grid grid-cols-2 gap-3">

                  <div>

                    <label className="mb-1 block text-[14px] font-bold uppercase tracking-wider text-text0">
                      Points
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        newTaskPoints
                      }
                      onChange={(
                        event
                      ) =>
                        setNewTaskPoints(
                          event.target
                            .value
                        )
                      }
                      className="w-full rounded-none border border-divider bg-surface px-3 py-2.5 text-[16px] text-text outline-none focus:border-accent"
                    />

                  </div>

                  <div>

                    <label className="mb-1 block text-[14px] font-bold uppercase tracking-wider text-text0">
                      Priority
                    </label>

                    <select
                      value={
                        newTaskPriority
                      }
                      onChange={(
                        event
                      ) =>
                        setNewTaskPriority(
                          event.target
                            .value
                        )
                      }
                      className="w-full rounded-none border border-divider bg-surface px-3 py-2.5 text-[16px] text-text outline-none focus:border-accent"
                    >

                      <option>
                        Low
                      </option>

                      <option>
                        Medium
                      </option>

                      <option>
                        High
                      </option>

                    </select>

                  </div>

                </div>

                {/* Checklist */}

                <div>

                  <label className="mb-1 block text-[14px] font-bold uppercase tracking-wider text-text0">
                    Checklist
                  </label>

                  <textarea
                    value={
                      newTaskChecklist
                    }
                    onChange={(event) =>
                      setNewTaskChecklist(
                        event.target
                          .value
                      )
                    }
                    rows={4}
                    className="w-full resize-none rounded-none border border-divider bg-surface px-3 py-2.5 text-[16px] text-text outline-none focus:border-accent"
                    placeholder="Research topic, Create design, Submit final version"
                  />

                  <p className="mt-1 text-[16px] text-muted">
                    Separate checklist
                    items with commas.
                  </p>

                </div>

                {/* Create */}

                <button
                  onClick={
                    createTask
                  }
                  disabled={
                    !newTaskTitle.trim() ||
                    !newTaskAssignee
                  }
                  className="w-full rounded-none bg-accent px-4 py-3 text-[16px] font-bold text-on-accent transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Create Task
                </button>

              </div>

            </div>

          </div>
        )}

      {/* =====================================================
          EVENT MODAL
          ===================================================== */}

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 "
          onClick={() =>
            setSelectedEvent(
              null
            )
          }
        >

          <div
            className="w-full max-w-lg rounded-none border border-divider bg-bg "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-start justify-between border-b border-divider p-5">

              <div>

                <div
                  className={`
                    mb-2 inline-flex rounded-none
                    border px-2 py-1
                    text-[14px] font-bold uppercase
                    ${getEventColor(
                      selectedEvent.type
                    )}
 `}
                >
                  {
                    selectedEvent.type
                  }
                </div>

                <h2 className="text-xl font-bold">
                  {
                    selectedEvent.title
                  }
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedEvent(
                    null
                  )
                }
                className="text-xl text-text0 hover:text-text"
              >
                ×
              </button>

            </div>

            <div className="space-y-4 p-5">

              <div>
                <p className="text-[16px] font-bold uppercase tracking-wider text-muted">
                  Date
                </p>

                <p className="mt-1 text-[16px] text-text">
                  {formatDate(
                    selectedEvent.date
                  )}

                  {selectedEvent.endDate &&
                    selectedEvent.endDate !==
                      selectedEvent.date && (
                      <>
                        {' '}
                        –{' '}
                        {formatDate(
                          selectedEvent.endDate
                        )}
                      </>
                    )}
                </p>
              </div>

              {(selectedEvent.startTime ||
                selectedEvent.endTime) && (
                <div>

                  <p className="text-[16px] font-bold uppercase tracking-wider text-muted">
                    Time
                  </p>

                  <p className="mt-1 text-[16px] text-text">
                    {formatTime(
                      selectedEvent.startTime
                    )}

                    {selectedEvent.endTime && (
                      <>
                        {' '}
                        –{' '}
                        {formatTime(
                          selectedEvent.endTime
                        )}
                      </>
                    )}
                  </p>

                </div>
              )}

              {selectedEvent.location && (
                <div>

                  <p className="text-[16px] font-bold uppercase tracking-wider text-muted">
                    Location
                  </p>

                  <p className="mt-1 text-[16px] text-text">
                    {
                      selectedEvent.location
                    }
                  </p>

                </div>
              )}

              {selectedEvent.description && (
                <div>

                  <p className="text-[16px] font-bold uppercase tracking-wider text-muted">
                    Description
                  </p>

                  <p className="mt-1 text-[16px] leading-6 text-text">
                    {
                      selectedEvent.description
                    }
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </main>
  );
}