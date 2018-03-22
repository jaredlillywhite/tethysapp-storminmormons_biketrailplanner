from tethys_sdk.base import TethysAppBase, url_map_maker


class StorminmormonsBiketrailplanner(TethysAppBase):
    """
    Tethys app class for Bike Trail Planner.
    """

    name = 'Bike Trail Planner'
    index = 'storminmormons_biketrailplanner:home'
    icon = 'storminmormons_biketrailplanner/images/BikeLogo.jpg'
    package = 'storminmormons_biketrailplanner'
    root_url = 'storminmormons-biketrailplanner'
    color = '#c0392b'
    description = 'This app calculates the optimal path for a new bike trail between two user-defined points based on user-defined parameters.'
    tags = 'Bike Trail'
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='storminmormons-biketrailplanner',
                controller='storminmormons_biketrailplanner.controllers.home'
            ),
        )

        return url_maps
