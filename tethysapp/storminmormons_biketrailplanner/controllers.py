from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import *

@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    save_button = Button(
        display_text='',
        name='save-button',
        icon='glyphicon glyphicon-floppy-disk',
        style='success',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Save'
        }
    )

    edit_button = Button(
        display_text='',
        name='edit-button',
        icon='glyphicon glyphicon-edit',
        style='warning',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Edit'
        }
    )

    remove_button = Button(
        display_text='',
        name='remove-button',
        icon='glyphicon glyphicon-remove',
        style='danger',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Remove'
        }
    )

    previous_button = Button(
        display_text='Previous',
        name='previous-button',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Previous'
        }
    )

    next_button = Button(
        display_text='Next',
        name='next-button',
        attributes={
            'data-toggle':'tooltip',
            'data-placement':'top',
            'title':'Next'
        }
    )

    context = {
        'save_button': save_button,
        'edit_button': edit_button,
        'remove_button': remove_button,
        'previous_button': previous_button,
        'next_button': next_button
    }

    return render(request, 'storminmormons_biketrailplanner/home.html', context)

@login_required
def mainmap(request):

    strtptbutton = Button(display_text='Starting Point',
                          icon='glyphicon glyphicon-map-marker',
                          )
    endptbutton = Button(display_text='Ending Point',
                         icon='glyphicon glyphicon-map-marker',)
    points = ButtonGroup(buttons=[strtptbutton,endptbutton])
    slider_bar= RangeSlider(display_text='Desired Trail Grade',
        name='slider_bar',
        min=0,
        max=20,
        initial=10,
        step=1
    )

    desired_features = SelectInput(display_text='Desired Route Features',
                                name='desired_features',
                                multiple=True,
                                options=[('Lakes', '1'), ('Schools', '2'), ('Shopping Centers', '3')],
                                initial=[],
                                select2_options={'placeholder': 'Choose Desired Route Features',
                                                 'allowClear': True})

    calcbutton = Button(
        display_text='Calculate Optimal Path',
        name='button',
        attributes={
            'data-toggle': 'tooltip',
            'data-placement': 'top',
            'title': 'Calculate',
            'onclick':'show_line_plot_button()'
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
        'calcbutton': calcbutton,
        'slider_bar': slider_bar,
        'viewplot': viewplot,
        'line_plot': line_plot,
        'points': points,
        'desired_features': desired_features,
    }

    return render(request, 'storminmormons_biketrailplanner/mainmap.html', context)
