// Sample visitor data - this data is in-memory and will reset on page refresh.
// For persistent data, a backend database would be required.
let sampleVisitors = [
    { id: 1, name: "John Smith", contact: "555-1234", email: "john.s@example.com", host: "Sarah Johnson", department: "Human Resources", purpose: "Interview", checkIn: "09:15 AM", checkOut: "10:30 AM", status: "completed" },
    { id: 2, name: "Emily Davis", contact: "555-5678", email: "emily.d@example.com", host: "Michael Brown", department: "IT Department", purpose: "Meeting", checkIn: "10:00 AM", checkOut: "", status: "active" },
    { id: 3, name: "Robert Wilson", contact: "555-9012", email: "robert.w@example.com", host: "Jennifer Lee", department: "Sales", purpose: "Delivery", checkIn: "11:30 AM", checkOut: "11:45 AM", status: "completed" },
    { id: 4, name: "Lisa Anderson", contact: "555-3456", email: "lisa.a@example.com", host: "David Miller", department: "Marketing", purpose: "Meeting", checkIn: "01:00 PM", checkOut: "", status: "active" },
    { id: 5, name: "James Taylor", contact: "555-7890", email: "james.t@example.com", host: "Patricia White", department: "Finance", purpose: "Personal Visit", checkIn: "02:15 PM", checkOut: "03:30 PM", status: "completed" }
];

// Get references to DOM elements
const darkModeToggle = document.getElementById('darkModeToggle');
const visitorForm = document.getElementById('visitorForm');
const visitorTableBody = document.getElementById('visitorTableBody');
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const mobileToggleBtn = document.getElementById('mobileToggle');
const notificationContainer = document.getElementById('notificationContainer');

// --- Functions ---

/**
 * Initializes dark mode based on local storage preference or system dark mode setting.
 * Adds event listener to the dark mode toggle switch.
 */
function initDarkMode() {
    // Check if dark mode preference is stored, otherwise check system preference
    if (localStorage.getItem('darkMode') === 'true' || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && 
        localStorage.getItem('darkMode') !== 'false')) {
        document.documentElement.classList.add('dark'); // Apply dark class to HTML element
        darkModeToggle.checked = true; // Set toggle switch to checked
    }

    // Event listener for dark mode toggle switch
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true'); // Store preference
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false'); // Store preference
        }
    });
}

/**
 * Populates the visitor table with data from the `sampleVisitors` array.
 * Creates table rows and cells dynamically.
 */
function populateVisitorTable() {
    visitorTableBody.innerHTML = ''; // Clear existing table rows before re-populating
    
    // Iterate over each visitor in the array
    sampleVisitors.forEach(visitor => {
        const row = document.createElement('tr');
        // Apply a specific background class for active visitors
        row.className = visitor.status === 'active' ? 'bg-green-50 dark:bg-green-900/20' : '';
        
        // Populate row HTML with visitor data
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                        <!-- Display visitor's initials as an avatar -->
                        <span class="text-primary-700 dark:text-primary-300 font-medium">${visitor.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${visitor.name}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">${visitor.contact}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-gray-100">${visitor.host}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">${visitor.department}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    ${visitor.purpose}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${visitor.checkIn}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${visitor.checkOut || '—'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${visitor.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}">
                    ${visitor.status === 'active' ? 'Active' : 'Completed'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <!-- Show checkout button only if visitor is active -->
                    ${visitor.status === 'active' ? `
                        <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 checkout-btn" data-id="${visitor.id}" title="Check Out">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    ` : ''}
                    <button class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" title="More Options">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            </td>
        `;
        
        visitorTableBody.appendChild(row);
    });

    // Attach event listeners to all newly created checkout buttons
    document.querySelectorAll('.checkout-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const visitorId = parseInt(this.getAttribute('data-id')); // Get visitor ID from data attribute
            checkoutVisitor(visitorId);
        });
    });
}

/**
 * Handles visitor checkout by updating their status and check-out time.
 * @param {number} id - The unique ID of the visitor to check out.
 */
function checkoutVisitor(id) {
    const visitor = sampleVisitors.find(v => v.id === id); // Find the visitor by ID
    if (visitor && visitor.status === 'active') {
        visitor.status = 'completed'; // Change status to completed
        visitor.checkOut = getCurrentTime(); // Set check-out time
        populateVisitorTable(); // Re-render the table to reflect changes
        
        // Show success notification
        showNotification(`${visitor.name} has been checked out successfully.`, 'success');
    }
}

/**
 * Handles the submission of the new visitor registration form.
 * @param {Event} event - The form submission event.
 */
function handleVisitorRegistration(event) {
    event.preventDefault(); // Prevent default form submission behavior (page reload)

    // Get form field values
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const email = document.getElementById('email').value;
    const purpose = document.getElementById('purpose').value;
    const host = document.getElementById('host').value;
    const department = document.getElementById('department').value;

    // Basic client-side validation
    if (!name || !contact || !purpose || !host || !department) {
        showNotification('Please fill in all required fields.', 'error');
        return; // Stop execution if validation fails
    }

    // Create a new visitor object
    const newVisitor = {
        // Generate a new unique ID (simple increment for client-side demo)
        id: sampleVisitors.length > 0 ? Math.max(...sampleVisitors.map(v => v.id)) + 1 : 1,
        name,
        contact,
        email,
        host,
        department,
        purpose,
        checkIn: getCurrentTime(), // Set current time as check-in
        checkOut: "", // Initially empty
        status: "active" // New visitors are active
    };

    sampleVisitors.push(newVisitor); // Add new visitor to the array
    populateVisitorTable(); // Update the table display
    visitorForm.reset(); // Clear the form fields after successful submission

    // Show success notification
    showNotification(`${name} has been registered successfully!`, 'success');
}

/**
 * Displays a transient notification message at the top right of the screen.
 * @param {string} message - The message content for the notification.
 * @param {string} type - The type of notification ('success', 'error', 'info') to determine styling and icon.
 */
function showNotification(message, type) {
    const notification = document.createElement('div');
    // Apply Tailwind classes for styling, animation, and responsiveness
    notification.className = `p-4 mb-3 rounded-lg shadow-md flex items-center transition-all duration-300 ease-in-out transform scale-95 opacity-0
        ${type === 'success' ? 'bg-green-500 text-white' : ''}
        ${type === 'error' ? 'bg-red-500 text-white' : ''}
        ${type === 'info' ? 'bg-blue-500 text-white' : ''}
    `;
    // Add icon and message content
    notification.innerHTML = `
        <div class="mr-3">
            ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : ''}
            ${type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : ''}
            ${type === 'info' ? '<i class="fas fa-info-circle"></i>' : ''}
        </div>
        <span>${message}</span>
    `;

    notificationContainer.appendChild(notification);

    // Trigger fade-in and scale-in animation
    setTimeout(() => {
        notification.classList.add('scale-100', 'opacity-100');
    }, 10); // Small delay to ensure CSS transition applies

    // Trigger fade-out and removal after 3 seconds
    setTimeout(() => {
        notification.classList.remove('scale-100', 'opacity-100');
        notification.classList.add('scale-95', 'opacity-0');
        // Remove element from DOM after transition completes
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 3000); // Notification visible for 3 seconds
}

/**
 * Gets the current time formatted as HH:MM AM/PM.
 * @returns {string} The formatted current time string.
 */
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // '0' hour becomes '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes; // Add leading zero if needed
    
    return `${hours}:${minutesStr} ${ampm}`;
}

// --- Event Listeners and Initializations ---

// Initialize Dark Mode when the script loads
initDarkMode();

// Event listener for opening the sidebar on mobile (menu icon in header)
openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('collapsed'); // Remove collapsed class
    sidebar.classList.remove('translate-x-full'); // Ensure sidebar is visible
});

// Event listener for closing the sidebar on mobile (X icon in sidebar)
closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('collapsed'); // Add collapsed class
    sidebar.classList.add('translate-x-full'); // Hide sidebar by translating it off-screen
});

// Event listener for the mobile floating action button (FAB) to toggle sidebar
mobileToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed'); // Toggle collapsed class
    sidebar.classList.toggle('translate-x-full'); // Toggle translation for visibility
});

// Event listener for the visitor registration form submission
visitorForm.addEventListener('submit', handleVisitorRegistration);

// Initial population of the visitor table when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', populateVisitorTable);

// Add smooth scrolling behavior for sidebar navigation links (optional for UX)
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default jump behavior

        // Scroll to the target section smoothly
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        // Close sidebar on mobile after clicking a navigation link
        if (window.innerWidth < 768) {
            sidebar.classList.add('collapsed');
            sidebar.classList.add('translate-x-full');
        }
    });
});
