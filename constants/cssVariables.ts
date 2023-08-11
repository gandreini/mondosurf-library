export { }
const globalStyle = getComputedStyle(document.body);
export const CSS_VARIABLES = {
    cssColorGray00: globalStyle.getPropertyValue('--color-gray-00'),
    cssColorGray01: globalStyle.getPropertyValue('--color-gray-01'),
    cssColorGray02: globalStyle.getPropertyValue('--color-gray-02'),
    cssColorGray03: globalStyle.getPropertyValue('--color-gray-03'),
    cssColorGray04: globalStyle.getPropertyValue('--color-gray-04'),
    cssColorGray05: globalStyle.getPropertyValue('--color-gray-05'),
    cssColorGray06: globalStyle.getPropertyValue('--color-gray-06'),
    cssColorText: globalStyle.getPropertyValue('--color-text'),
    cssColorTextLight: globalStyle.getPropertyValue('--color-text-light'),
    cssColorSwell: globalStyle.getPropertyValue('--color-chart-swell'),
    cssColorWind: globalStyle.getPropertyValue('--color-chart-wind'),
    cssColorPeriod: globalStyle.getPropertyValue('--color-chart-period'),
    cssColorTide: globalStyle.getPropertyValue('--color-chart-tide'),

    // Forecast colors.
    cssColorForecastPossible: globalStyle.getPropertyValue('--color-forecast-possible'),
    cssColorForecastGood: globalStyle.getPropertyValue('--color-forecast-good'),
    cssColorForecastVeryGood: globalStyle.getPropertyValue('--color-forecast-very-good'),
    cssColorForecastEpic: globalStyle.getPropertyValue('--color-forecast-epic'),

    cssColorChartAframe: globalStyle.getPropertyValue('--color-chart-pie-aframe'),
    cssColorChartRight: globalStyle.getPropertyValue('--color-chart-pie-right'),
    cssColorChartLeft: globalStyle.getPropertyValue('--color-chart-pie-left'),
    cssColorChartSand: globalStyle.getPropertyValue('--color-chart-pie-sand'),
    cssColorChartSandRocks: globalStyle.getPropertyValue('--color-chart-pie-sand-rocks'),
    cssColorChartRocks: globalStyle.getPropertyValue('--color-chart-pie-rocks'),
    cssColorChartRocksSand: globalStyle.getPropertyValue('--color-chart-pie-rocks-sand'),
    cssColorChartReef: globalStyle.getPropertyValue('--color-chart-pie-reef'),
    cssColorChartReefSand: globalStyle.getPropertyValue('--color-chart-pie-reef-sand'),
    cssColorChartBoulders: globalStyle.getPropertyValue('--color-chart-pie-boulders'),
    cssColorChartCobbles: globalStyle.getPropertyValue('--color-chart-pie-cobbles'),
    cssFontMain: globalStyle.getPropertyValue('--font-family-main'),
    cssFontHeadings: globalStyle.getPropertyValue('--font-family-headings'),
    cssChartDirectionLabelSize: globalStyle.getPropertyValue('--chart-direction-label-size'),
    cssChartBarLabelSize: globalStyle.getPropertyValue('--chart-bar-label-size'),
    cssChartBarLabelSizeSmall: globalStyle.getPropertyValue('--chart-bar-label-size-small'),
    cssChartLineLabelSize: globalStyle.getPropertyValue('--chart-line-label-size'),
    cssDesktopBreakpoint: parseInt(globalStyle.getPropertyValue('--desktop-breakpoint'))
};