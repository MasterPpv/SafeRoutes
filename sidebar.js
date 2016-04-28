var status = 0;
function show(sidebar){

	if(status == 0) {
		sidebar.style.left = "0px";
		sidebar.style.transition = "left 0.6s linear";
		status = 1;
	}
	else
	{
		sidebar.style.left = "-200px";
		sidebar.style.transition = "left 0.6s linear";
		status = 0;
	}
}