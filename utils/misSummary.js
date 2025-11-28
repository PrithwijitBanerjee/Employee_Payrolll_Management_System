const STATUS_MAP = {
  "003": "pending",
  "004": "wip",
  "005": "completed"
};

function computeSummary(tasks) {
  const summary = {
    pending: 0,
    wip: 0,
    completed: 0,
    totalDuration: 0,
    avgDuration: 0,
    pendingAlerts: 0,
    overdue: 0
  };

  tasks.forEach(task => {
    const key = STATUS_MAP[task.TaskStatus];
    if (key) summary[key] += 1;

    if (task.DurationMin) summary.totalDuration += task.DurationMin;

    if (isBeforeDeadline(task)) summary.pendingAlerts += 1;
    if (isDeadlineOver(task)) summary.overdue += 1;
  });

  const totalTasks = summary.pending + summary.wip + summary.completed;
  summary.avgDuration = totalTasks ? Math.round(summary.totalDuration / totalTasks) : 0;

  return summary;
}

function isBeforeDeadline(task) {
  if (!task.job?.ExpectedDeliveryDate) return false;
  return new Date() < new Date(task.job.ExpectedDeliveryDate);
}

function isDeadlineOver(task) {
  if (!task.job?.ExpectedDeliveryDate) return false;
  return new Date() > new Date(task.job.ExpectedDeliveryDate);
}

module.exports = { computeSummary };
