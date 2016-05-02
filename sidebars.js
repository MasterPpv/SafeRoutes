var sidebar_showing = false;
var current_sidebar_index = -1;
var sidebars = [document.getElementById('sidebar-menu'), document.getElementById('sidebar-dir'), document.getElementById('sidebar-submit')];

function change_sidebar(new_sidebar_index){
    if (sidebar_showing) {
        close_sidebar(sidebars[current_sidebar_index]);
        sidebar_showing = false;
    }
    if (current_sidebar_index != new_sidebar_index) {
        open_sidebar(sidebars[new_sidebar_index]);
        current_sidebar_index = new_sidebar_index;
        sidebar_showing = true;
    } else {
        current_sidebar_index = -1;
    }
}

function open_sidebar(sidebar) {
    sidebar.style.left = "0px";
    sidebar.style.transition = "left 0.4s linear";
}

function close_sidebar(sidebar) {
    sidebar.style.left = "-400px";
    sidebar.style.transition = "left 0.4s linear";
}
