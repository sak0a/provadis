    /**
 * SLIDE IN ROWS WITH ANIME JS OR SMTH ELSE
 * @type {*[]}
 *
 * Add a search type like user64?$sid to search first the user by name and then by steamid (so all other names are included)
 */


let responseData =  [];

function sendRequest() {
    const user = document.querySelector('input[name=usersearch]').value;
    const teams = document.querySelector('select[name=teams]').value;
    const order = document.querySelector('select[name=order]').value;
    const page = document.querySelector('input[name=page]').value;


    const xhr = new XMLHttpRequest();
    xhr.open('GET', '?ajax=1&f=get_messages&team=' + encodeURIComponent(teams) + '&user=' + encodeURIComponent(user) + '&order=' + order + '&page=' + page, true);
    xhr.onload = function() {
        if (this.status === 200) {
            console.log("RESPONSE:", this.responseText)
            responseData = JSON.parse(this.responseText);
        } else {
            console.log('AJAX error: ' + this.status);
            console.log(this.responseText)
        }
        insertPagination();
        insertTableData();
    };
    xhr.send();
}

function getMessageTypeClass(messageType, team) {
    if (messageType === '1') {
        if (team === '3') {
            return "text-blue-400 bg-blue-400/10";
        } else if (team === '2') {
            return "text-red-400 bg-red-400/10";
        } else if (team === '1') {
            return "text-yellow-400 bg-yellow-400/10"
        } else {
            return "text-orange-400 bg-orange-400/10";
        }
    } else {
        return "text-green-400 bg-green-400/10";
    }
}
function getPaginationClass(pageNumber, totalPages) {
    if (pageNumber === totalPages) {
        return "rounded-r-md";
    } else if (pageNumber === 1) {
        return "rounded-l-md";
    } else {
        return "";
    }
}

function insertPagination() {
    const results = document.getElementById('pagination_results');
    const navigation = document.getElementById('pagination_nav');
    const form = document.getElementById('pagination_form');

    results.getElementsByClassName('start-range')[0].innerHTML = responseData['start_range'];
    results.getElementsByClassName('end-range')[0].innerHTML = responseData['end_range'];
    results.getElementsByClassName('total-results')[0].innerHTML = responseData['total_messages'];

    form.querySelector('input[name=page]').setAttribute('max', '' + responseData['total_pages'] + '');

    const currentPage = responseData['current_page'];
    const pageRange = responseData['page_range'];
    const totalPages = responseData['total_pages'];


    navigation.innerHTML = '';
    if (currentPage > 1) {
        const element = document.createElement('a');
        element.setAttribute('data-page', '1' );
        element.className = "relative inline-flex items-center rounded-l-md text-gray-400 px-1.5 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0";
        element.innerHTML = 'back';
            //             '<span class="sr-only">First</span>' +
            //'back <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">' +
        //'   <path fill-rule="evenodd" d="M10.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L12.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z" clip-rule="evenodd" />' +
          //  '   <path fill-rule="evenodd" d="M4.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L6.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z" clip-rule="evenodd" />' +
            //'</svg>-->';
        navigation.appendChild(element);
    }

    for (let i = Math.max(1, currentPage - pageRange); i <= Math.min(currentPage + pageRange, totalPages); i++) {
        const element = document.createElement('a');
        element.setAttribute('data-page', '' + i + '');

        if (i === currentPage) {
            element.className = getPaginationClass(currentPage, totalPages) + " relative z-10 inline-flex px-1.5 items-center bg-[#B68764] text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
        } else {
            element.className = " relative hidden items-center text-sm font-normal px-1.5 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex";
        }

        if (responseData['total_messages'] <= responseData['page_size']) {
            element.classList.add('rounded-md')
        }
        element.innerHTML = '' + i + '';
        navigation.appendChild(element);
    }

    if (currentPage < totalPages) {
        const element = document.createElement('a');
        element.setAttribute('data-page', '' + totalPages + '');
        element.className = " relative inline-flex items-center rounded-r-md px-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0";
        element.innerHTML = 'next';
            //'<span class="sr-only">Last</span>' +
            //' <!-- <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">' +
            //'   <path fill-rule="evenodd" d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />' +
            //'   <path fill-rule="evenodd" d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />' +
            //'</svg>-->';
        navigation.appendChild(element);
    }
}
function insertTableData() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    for (let i = 0; i < responseData['messages'].length; i++) {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        const message = responseData['messages'][i];

        const messageStyle = message['message_style'];
        const team = message['team'];
        const messageTypeClass = getMessageTypeClass(messageStyle, team);
        const messageType = messageStyle === '1' ? "Team" : "All";

        row.innerHTML = '' +
            '<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">' + message['name'] + '</td>' +
            '<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300 transition-colors duration-250 hover:text-[#B68764]"> <a href="http://steamcommunity.com/profiles/' +  message['community_id'] + '" target="_blank">' + message['steamid'] + '</a></td>' +
            '<td class="whitespace-nowrap px-1 py-4 text-sm text-gray-300">' + message['date'] + '</td>' +
            '<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">' +
            '   <div class="flex items-center justify-end gap-x-2 sm:justify-start">' +
            '       <div class="flex-none rounded-full animate-pulse p-1.5 ' + messageTypeClass + '">' +
            '           <div class="h-2 w-2 rounded-full bg-current"></div> ' +
            '       </div>' +
            '       <div class="hidden text-white sm:block">' + messageType + '</div>' +
            '   </div>' +
            '</td>' +
            '<td class="max-w-xs whitespace-normal break-words px-3 py-4 text-sm text-gray-300">' + message['message'] + '</td>';
        //'<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">' +
        //'   <a href="#" class="text-[#B68764] duration-200  transition-colors ease-in-out hover:text-white">Edit<span class="sr-only">, Lindsay Walton</span></a>' +
        //'</td>';
        tableBody.appendChild(row);
        anime({
            targets: row,
            opacity: 1,
            translateY: [-50, 0], // Slide from 50px above to its original position
            duration: 800, // Duration of animation in milliseconds
            easing: 'easeOutExpo', // Easing function
            delay: i * 50 // Staggered delay for each row
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    anime({
        targets: document.getElementById('main-container'),
        opacity: [0, 1], // Animate opacity from 0 to 1
        duration: 800, // Duration of animation in milliseconds
        easing: 'easeOutQuad', // Easing function for a smooth fade-in
        delay: 2 * 50 // Staggered delay for each row
    });
    sendRequest();
    // Event listener for search inputs
    const searchInputs = document.querySelectorAll('input[name=usersearch]');
    searchInputs.forEach(function(input) {
        input.addEventListener('keyup', sendRequest);
    });

    // Event listener for order change
    document.querySelector('select[name=order]').addEventListener('change', sendRequest);

    // Event listener for team change
    document.querySelector('select[name=teams]').addEventListener('change', sendRequest);

    // Event listener for pagination links
    document.addEventListener('click', function(event) {
        const element = event.target;
        if (element.tagName === 'A' && element.hasAttribute('data-page')) {
            event.preventDefault();
            document.querySelector('input[name=page]').value = element.getAttribute('data-page');
            sendRequest();
        }
    });
});
