interface Activity {
  username: string;
  usernameColor?: string;
  feed: string;
  highlight?: string;
  highlightColor?: string;
}

const activityElement = document.getElementById("activity") as HTMLDivElement;

function fixActivityLength(maxLength: number) {
  const children = activityElement.getElementsByTagName("div");
  if (children.length > maxLength) {
    activityElement.removeChild(children[0]);
  }
}

export function addActivityItem(activity: Activity) {
  const { username, usernameColor, feed, highlightColor, highlight } = activity;
  const item = document.createElement("div");

  item.classList.add("activity-item");
  item.innerHTML = `
    <span class="activity-user" style="color: ${
      usernameColor || "purple"
    }">${username}</span>
    <span class="activity-feed">${feed}</span>
    <span class="activity-highlight" style="color: ${
      highlightColor || "orange"
    }">${highlight}</span>
  `;

  activityElement.appendChild(item);
  fixActivityLength(20);
}

export function clearActivity() {
  activityElement.innerHTML = "";
}

// Auto scroll activity.
function scrollActivity() {
  activityElement.scrollBy(0, 1);
}

setInterval(scrollActivity, 5);
