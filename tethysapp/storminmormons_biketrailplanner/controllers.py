from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import *

@login_required()
def home(request):
    context = {
    }
    return render(request, 'storminmormons_biketrailplanner/home.html', context)
def proposal(request):
    context = {
    }
    return render(request, 'storminmormons_biketrailplanner/proposal.html', context)
def mockup(request):
    context = {
    }
    return render(request, 'storminmormons_biketrailplanner/mockup.html', context)


@login_required
def mainmap(request):

    strtptbutton = Button(display_text='Starting Point',
                          icon='glyphicon glyphicon-map-marker',
                          attributes={"onclick": "app.run_start()"},
                          )
    endptbutton = Button(display_text='Ending Point',
                         icon='glyphicon glyphicon-map-marker',
                         attributes={"onclick": "app.run_service()"},)
    points = ButtonGroup(buttons=[strtptbutton,endptbutton])


    desired_features = SelectInput(display_text='Desired Route Features',
                                name='desired_features',
                                multiple=True,
                                options=[('Lakes', '1'), ('Schools', '2'), ('Shopping Centers', '3')],
                                initial=[],
                                select2_options={'placeholder': 'Choose Desired Route Features',
                                                 'allowClear': True})

    calcbutton = Button(
        display_text='Calculate Path',
        name='button',

        attributes={
            'data-toggle': 'tooltip',
            'data-placement': 'top',
            'title': 'Calculate Path',
            'onclick':'app.calculate()'

        },
    )


    refreshbutton = Button(
        display_text='Refesh',
        name='button',
        attributes={
            'data-toggle': 'tooltip',
            'data-placement': 'top',
            'title': 'refresh',
            'onclick':'app.refresh()'

        },
    )

    viewplot = Button(display_text='View Elevation Profile',
                      name='viewplot',
                      style='',
                      icon='',
                      href='',
                      submit=False,
                      disabled=False,
                      attributes={"onclick": "line_plot_modal()"},
                      classes=''
    )

    line_plot = LinePlot(

        engine='highcharts',
        title='Elevation Profile',
        subtitle='Utah Bike Trail',
        spline=True,
        x_axis_title='Distance',
        x_axis_units='mi',
        y_axis_title='Elevation',
        y_axis_units='Ft',
        series=[
            {
                'name': 'Elevation',
                'color': '#0066ff',
                'marker': {'enabled': False},
                'data': [
                    [0, 5], [10, -70],
                    [20, -86.5], [30, -66.5],
                    [40, -32.1],
                    [50, -12.5], [60, -47.7],
                    [70, -85.7], [80, -106.5]
                ]
            },
        ]
    )
    context = {
        'refreshbutton': refreshbutton,
        'calcbutton': calcbutton,
        'viewplot': viewplot,
        'line_plot': line_plot,
        'points': points,
        'desired_features': desired_features,
    }

    return render(request, 'storminmormons_biketrailplanner/mainmap.html', context)
