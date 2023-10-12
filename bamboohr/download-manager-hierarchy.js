// ==UserScript==
// @name         Download Manager Report
// @namespace    https://github.com/florianpasteur/tampermonkey-extensions
// @version      0.28
// @description  Download manager hierarchy per user
// @author       Florian Pasteur
// @match        https://backbase.bamboohr.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAADAFBMVEVHcEzq6ur19vbw8PDz8/P09PXy8fH5+fnu7u76+/v5+fny8vLv7+/t7e3f398nJycBAQEBAQEAAADg4OAAAAAAAAD39/cAAAAAAADZ2toCAgIGBgYAAAAAAAD19fUAAAABAQEAAAACAgIAAAAAAAACAgIAAAAAAAAAAAAAAAAAAADy8vLi4+MsgN81huZEj/AAAAD44dfz8/MBAQH///oAAADc3uH09PQAAAAAAAASEhISb8pAQEDv7+/g4ODk6vH39/cCAgIEBATOzs6pqakeHh4CAgIAAAD149utra3e3t7s7Ozt7u/39/fg4ODW1tZJSUk5OTnW1tbx8fFjY2NWVlb59PHKycj58e313dJLkvBtbW3V1dTFxcX97eb39/f5+fmmpqbn5+f29vahoaGLi4vt7e3r6+u10/ksLCwhISHg4OC4uLiTk5O1tbU9idtKSkpWVlbd3d3BwcEkJCSurq4WFhbn7vY7crIkZbGJiYlMTExgoPZviaorKytmZmYAAABtfpFISEiQkJCenp6xsbH7+/v5+fn7+/uRxv+Pxf6+3P2/v7///fqQxf6GvP0wMDDg6/yHh4cxMTFmZmZ0dHSQwvmhx/QaGho8PDx0qt9lZWUKX7aenp766+ObsMgAAAC2s6/t3df68PTv7+/6+vnz8/P19fb7/Pzw8PD09PTx8fHy8vP39/f4+Pjn5+fr6+vo6Ojk5OTu2uT8/P3q6uri4uLu7u7b29vl5eXt7e3e3t7X19f+/v7Hx8f////c3Nz+/Pp4sv/AwMCurq745+D008X65Nt/t/8cdtT69vRnpf27u7qGhoaJv/+enZ0ieddvqv3Q0NDNzc0qfdqsrKu3t7azs7Py1srz9PVQlveXl5c9iuoWc9EHacj06eRQdaWkpKSQxP5ycnLKysrz2c//+PPx7Ol6enpbnOzJ3fQwZqVvntKOkplJhtHo8fqWwPzX3uefvNuUvOhfneaMor7c6PIAUKm10OoAYcH19PR8krOxu8vq4tw3eMXaw7oloP/zAAAA7XRSTlMA/v3+/v7+/v7//f3+/v8BBQIN/hUm/SAc/nRNOEn+WoZ9LioRNVRmPm0K/v7+/v6N/lYH/pcPsEFivP7NOBoE/p9f/f2WPET+TQl1KGvxWffgJJn+9v79/v7+5v7//o3j55fNdxHt2v7byZSC6V796MbN9bX6sPn+/uys/v6o9DL+2fOawti3g6PL6Y78e/1h/dVsmrtTLYiI/db988X9pv39/////////////////v////////////////////////7///7///////////////////////////////////////////////////4XHcyOAAAIKElEQVRYw9WXZ3QTVxbHLWmwymhcJHlsyUYuYHAD2yh2DDgJ1UCWkgCh2qRsssmmbHpvTrIl2V1v7333jGY0RVN0rBmNJDtyAwMGgjEGQm+B1O0tW++MbRLbUhbYT7nnvHP05d73/r/3v3ee0tI+HbHii6M/6m+8iuzr779939EV9detuvUrt5lXXXH6mi8dHG5pVr1+c5APLgheeyW5N6ycc8fqMN9hbQ9YzRA4rNsuL7V+5ZxXr/0ybvXrgcOyaQV4ihWv/x+b/vAH33jtq19rs5qtVth1NNnvN+OkIhrCIk3N+QRYq9b94sk/nTlzZu+ZLpvfZtOX2WYzpmOiiKFGnMdxPHhr6gL3dwT63npv79693+z/bcBmtfptQZKwKApnHNWP8zwf/GzqAl8gA7u2/XJ/f39/9z1dXpYm7Bxlto3p1xbFRQ3qDanys9fGAoEdzR/0d3d39+/Czbr2MYC8lxZFg0gwRv661Ed4lD+y2X6qu3v//t3f9ttw3KwzwBELpJoQHF8ADCjqMymyM9c8MhCw7mh76bn9UOB3bRp5hlYsCkvi/Ih+I89TCJXcSivvWx2P97ZbN207+MHu3c+9+aaXJQgTwwODSwCDRlKSnc7VSfnJEXc8fogL+HccOKXlV9/TNcpABxikTGI4DAzgBFQyK604kHC74y3NCLJZeGnLli3V1W+36R6wmY2oBRMx0xQj6PciyBSESWql2+VEc2dLT3t7rX/fv6urq4/NfsfPI7SiWFgmiJt5HueDlJeiOIOccV+yAncOnjsQdx9qD2x7a/hU9bFjx2a/vYFD+I8MhPOsVCXLqoFlklrprseBgrs34N+w49z7Q7MhZr3TNQqQxznoA1UiQD+DMMyUJFbKTvueUysQ8i6orfr1U7NnQTzYBh4wVlowDEO9oN8L+oEBioWSWCnbV9ITObex80CHv5YZeH5o1tDQ0M4/blAUwhu8pJ9CFNUZc6pKEitlOxzfj0TckeEOf9+ulp6nh96AOP6kLgEKBCnKIshySKIZhCTJyVbKzHK48jtjkUhvu/FC3+DG59/YCXH8wWs0gEHSEFJDBlbXTyIkw35u0vkrHK4813eE+OJ93gW2WmFw8dM7jx+fP//ET9rsQMBeOaofwi45YzF57bh82N2Vl5eb+92WxZGehM1ayzXH/gHZ7/35qb/+wa8dX9cP0ywkO0MGmiTZcVbKrHBBdg7EA0IkPmC17vjQ7Y68O//E3zquUX4PMwAKMIoQklURBf0oB7Fu3Al8LkifBvHj5kSiF2dPnqySg//82d//os2CoJcNqyE1zIF+HSBCS3LikQk3kJdTUtLa2lrw8+bFpwM2W63FYOs4dQK3USgmCAZU11+pLTtcYyyEpZvGf5+yXDmtpaUFBaXPRjKGJau1dgpl5sV3dykoM6afYVBRBQIijbIsa2LHWymzIre1oKmprCx/iTzY2e6vTWcJ2tsF90/pBfTkUJjmNP0oy7FCxgQrZU+f1tTQ0LCs4Vn5wOMUc3LTSBMFjVDALqmqQHAkogMkaSGWSMjiRCv58kqXTYVYdNC5pMOGL4fZB98ABJMEAUOREQ+gqEkAAoIJtdvtE62U6chpyNfiYfUga/bXWnk4tiSadP2aA0lClWXZQIN+mqbthLR2ohldpfkzIDwDGwfNRzazNOmlxgCSUTUUUi2kpl8rEHZGIhmTppIvt2FGIcRPm3uDwb4Nfl2/F5IF9SMDoawoRxJy2K4o6ya1k6Mkf9HcuXN/1LOkA9/UhxvB/hoCy0gLoGglKlaBB0ST3W6xYNG7Jze0q6lwJsTWXhjl5zlRkkQW0SRoDmSjqlNWlRH9BCFluN31aZNFTJ1ZXl6+dF+cxLYTpHcMIBcFE0gEyo0ANMiJSEyKEl+fPFQcJYXlHo9n64AZP09S+u4kNJEK7hsByFnUWMIpKAQWjRKP3phERNlMT7HnhaPt3r7lRi9iEQRBRDUAlSiKpoMJnIIFAsMsmBBruTMtiYh8T3Fx8Yuve8nDwEAhxzoQFUNOp0To+i1RUXbHE6r4QJLZXlGyqLio6DFZjG6nxgCiiipXScSIgeioGoskQmJUFNmHk70QpjeVFxXV9Pj5wx/qAGlJ1ZtINxAhOhOJkEGBbAh1TbLPS1ZefnFNzTMdxtqTXtQgCJJJ029KR01YyBmrEu0AAJ5LojPeHLkj6VfeN21RUU3j6+SFw1KYHu1ADmYQ9IGmX4HtpUQ8LodF6e7kzwxHk6fmCTnKbTeOAORgFEAT6QZSLGIo4o5J8NwLhzF7ffKHUl5hzcIWntIKkNosAH4jABXJGYmpOgCDQqgDe+5KcYSy4rpnAsbzF0RBNZjg/oGByYSpsViVQQMgYnZ7fMnFmxq/leKplJUzs+5la/hf51lutANpUc6Qw6BfwRSCxjqPrr/p8/Pq8h2pnmrTpxbNkxhq+xENIEvAJ1G16ABp1iQf2nPLzffOW1hX4ylLWcBX4vlVZ1ArAAC1TtAA0iyiDJ4+C1svrCnyzJzRUOLKTlUg01VY94p1ymGYJMDApAWCCD3vr7/53oVFxeWFUwum5U2vyMpM/dysKCh+mZR+s5zUHYgyjLsXDv5EkWfujIbWXJfD90nJ+k3mzp1HMOmHoQBJ0Z37zj70WNGljbMzL+PfhmNZXQuFbA9SzkN7zq5/aOmMssva+GNHyCl/pQP5z+mLew4evWVpWa7rMjf+2E0uazy9tXGPOvzi0oK8iqwr/58HTZnfOrXx4gulLl/2Vf3PzPL5fK6mAkdWZtrVR2b2/5P9qYr/AmdL2Z+sZodtAAAAAElFTkSuQmCC
// @icon64         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAADAFBMVEVHcEzq6ur19vbw8PDz8/P09PXy8fH5+fnu7u76+/v5+fny8vLv7+/t7e3f398nJycBAQEBAQEAAADg4OAAAAAAAAD39/cAAAAAAADZ2toCAgIGBgYAAAAAAAD19fUAAAABAQEAAAACAgIAAAAAAAACAgIAAAAAAAAAAAAAAAAAAADy8vLi4+MsgN81huZEj/AAAAD44dfz8/MBAQH///oAAADc3uH09PQAAAAAAAASEhISb8pAQEDv7+/g4ODk6vH39/cCAgIEBATOzs6pqakeHh4CAgIAAAD149utra3e3t7s7Ozt7u/39/fg4ODW1tZJSUk5OTnW1tbx8fFjY2NWVlb59PHKycj58e313dJLkvBtbW3V1dTFxcX97eb39/f5+fmmpqbn5+f29vahoaGLi4vt7e3r6+u10/ksLCwhISHg4OC4uLiTk5O1tbU9idtKSkpWVlbd3d3BwcEkJCSurq4WFhbn7vY7crIkZbGJiYlMTExgoPZviaorKytmZmYAAABtfpFISEiQkJCenp6xsbH7+/v5+fn7+/uRxv+Pxf6+3P2/v7///fqQxf6GvP0wMDDg6/yHh4cxMTFmZmZ0dHSQwvmhx/QaGho8PDx0qt9lZWUKX7aenp766+ObsMgAAAC2s6/t3df68PTv7+/6+vnz8/P19fb7/Pzw8PD09PTx8fHy8vP39/f4+Pjn5+fr6+vo6Ojk5OTu2uT8/P3q6uri4uLu7u7b29vl5eXt7e3e3t7X19f+/v7Hx8f////c3Nz+/Pp4sv/AwMCurq745+D008X65Nt/t/8cdtT69vRnpf27u7qGhoaJv/+enZ0ieddvqv3Q0NDNzc0qfdqsrKu3t7azs7Py1srz9PVQlveXl5c9iuoWc9EHacj06eRQdaWkpKSQxP5ycnLKysrz2c//+PPx7Ol6enpbnOzJ3fQwZqVvntKOkplJhtHo8fqWwPzX3uefvNuUvOhfneaMor7c6PIAUKm10OoAYcH19PR8krOxu8vq4tw3eMXaw7oloP/zAAAA7XRSTlMA/v3+/v7+/v7//f3+/v8BBQIN/hUm/SAc/nRNOEn+WoZ9LioRNVRmPm0K/v7+/v6N/lYH/pcPsEFivP7NOBoE/p9f/f2WPET+TQl1KGvxWffgJJn+9v79/v7+5v7//o3j55fNdxHt2v7byZSC6V796MbN9bX6sPn+/uys/v6o9DL+2fOawti3g6PL6Y78e/1h/dVsmrtTLYiI/db988X9pv39/////////////////v////////////////////////7///7///////////////////////////////////////////////////4XHcyOAAAIKElEQVRYw9WXZ3QTVxbHLWmwymhcJHlsyUYuYHAD2yh2DDgJ1UCWkgCh2qRsssmmbHpvTrIl2V1v7333jGY0RVN0rBmNJDtyAwMGgjEGQm+B1O0tW++MbRLbUhbYT7nnvHP05d73/r/3v3ee0tI+HbHii6M/6m+8iuzr779939EV9detuvUrt5lXXXH6mi8dHG5pVr1+c5APLgheeyW5N6ycc8fqMN9hbQ9YzRA4rNsuL7V+5ZxXr/0ybvXrgcOyaQV4ihWv/x+b/vAH33jtq19rs5qtVth1NNnvN+OkIhrCIk3N+QRYq9b94sk/nTlzZu+ZLpvfZtOX2WYzpmOiiKFGnMdxPHhr6gL3dwT63npv79693+z/bcBmtfptQZKwKApnHNWP8zwf/GzqAl8gA7u2/XJ/f39/9z1dXpYm7Bxlto3p1xbFRQ3qDanys9fGAoEdzR/0d3d39+/Czbr2MYC8lxZFg0gwRv661Ed4lD+y2X6qu3v//t3f9ttw3KwzwBELpJoQHF8ADCjqMymyM9c8MhCw7mh76bn9UOB3bRp5hlYsCkvi/Ih+I89TCJXcSivvWx2P97ZbN207+MHu3c+9+aaXJQgTwwODSwCDRlKSnc7VSfnJEXc8fogL+HccOKXlV9/TNcpABxikTGI4DAzgBFQyK604kHC74y3NCLJZeGnLli3V1W+36R6wmY2oBRMx0xQj6PciyBSESWql2+VEc2dLT3t7rX/fv6urq4/NfsfPI7SiWFgmiJt5HueDlJeiOIOccV+yAncOnjsQdx9qD2x7a/hU9bFjx2a/vYFD+I8MhPOsVCXLqoFlklrprseBgrs34N+w49z7Q7MhZr3TNQqQxznoA1UiQD+DMMyUJFbKTvueUysQ8i6orfr1U7NnQTzYBh4wVlowDEO9oN8L+oEBioWSWCnbV9ITObex80CHv5YZeH5o1tDQ0M4/blAUwhu8pJ9CFNUZc6pKEitlOxzfj0TckeEOf9+ulp6nh96AOP6kLgEKBCnKIshySKIZhCTJyVbKzHK48jtjkUhvu/FC3+DG59/YCXH8wWs0gEHSEFJDBlbXTyIkw35u0vkrHK4813eE+OJ93gW2WmFw8dM7jx+fP//ET9rsQMBeOaofwi45YzF57bh82N2Vl5eb+92WxZGehM1ayzXH/gHZ7/35qb/+wa8dX9cP0ywkO0MGmiTZcVbKrHBBdg7EA0IkPmC17vjQ7Y68O//E3zquUX4PMwAKMIoQklURBf0oB7Fu3Al8LkifBvHj5kSiF2dPnqySg//82d//os2CoJcNqyE1zIF+HSBCS3LikQk3kJdTUtLa2lrw8+bFpwM2W63FYOs4dQK3USgmCAZU11+pLTtcYyyEpZvGf5+yXDmtpaUFBaXPRjKGJau1dgpl5sV3dykoM6afYVBRBQIijbIsa2LHWymzIre1oKmprCx/iTzY2e6vTWcJ2tsF90/pBfTkUJjmNP0oy7FCxgQrZU+f1tTQ0LCs4Vn5wOMUc3LTSBMFjVDALqmqQHAkogMkaSGWSMjiRCv58kqXTYVYdNC5pMOGL4fZB98ABJMEAUOREQ+gqEkAAoIJtdvtE62U6chpyNfiYfUga/bXWnk4tiSadP2aA0lClWXZQIN+mqbthLR2ohldpfkzIDwDGwfNRzazNOmlxgCSUTUUUi2kpl8rEHZGIhmTppIvt2FGIcRPm3uDwb4Nfl2/F5IF9SMDoawoRxJy2K4o6ya1k6Mkf9HcuXN/1LOkA9/UhxvB/hoCy0gLoGglKlaBB0ST3W6xYNG7Jze0q6lwJsTWXhjl5zlRkkQW0SRoDmSjqlNWlRH9BCFluN31aZNFTJ1ZXl6+dF+cxLYTpHcMIBcFE0gEyo0ANMiJSEyKEl+fPFQcJYXlHo9n64AZP09S+u4kNJEK7hsByFnUWMIpKAQWjRKP3phERNlMT7HnhaPt3r7lRi9iEQRBRDUAlSiKpoMJnIIFAsMsmBBruTMtiYh8T3Fx8Yuve8nDwEAhxzoQFUNOp0To+i1RUXbHE6r4QJLZXlGyqLio6DFZjG6nxgCiiipXScSIgeioGoskQmJUFNmHk70QpjeVFxXV9Pj5wx/qAGlJ1ZtINxAhOhOJkEGBbAh1TbLPS1ZefnFNzTMdxtqTXtQgCJJJ029KR01YyBmrEu0AAJ5LojPeHLkj6VfeN21RUU3j6+SFw1KYHu1ADmYQ9IGmX4HtpUQ8LodF6e7kzwxHk6fmCTnKbTeOAORgFEAT6QZSLGIo4o5J8NwLhzF7ffKHUl5hzcIWntIKkNosAH4jABXJGYmpOgCDQqgDe+5KcYSy4rpnAsbzF0RBNZjg/oGByYSpsViVQQMgYnZ7fMnFmxq/leKplJUzs+5la/hf51lutANpUc6Qw6BfwRSCxjqPrr/p8/Pq8h2pnmrTpxbNkxhq+xENIEvAJ1G16ABp1iQf2nPLzffOW1hX4ylLWcBX4vlVZ1ArAAC1TtAA0iyiDJ4+C1svrCnyzJzRUOLKTlUg01VY94p1ymGYJMDApAWCCD3vr7/53oVFxeWFUwum5U2vyMpM/dysKCh+mZR+s5zUHYgyjLsXDv5EkWfujIbWXJfD90nJ+k3mzp1HMOmHoQBJ0Z37zj70WNGljbMzL+PfhmNZXQuFbA9SzkN7zq5/aOmMssva+GNHyCl/pQP5z+mLew4evWVpWa7rMjf+2E0uazy9tXGPOvzi0oK8iqwr/58HTZnfOrXx4gulLl/2Vf3PzPL5fK6mAkdWZtrVR2b2/5P9qYr/AmdL2Z+sZodtAAAAAElFTkSuQmCC
// @run-at       context-menu
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.min.js
// ==/UserScript==

(async function () {
    'use strict';

    console.log("Loading");
    const overlay = showOverlay();

    try {

        const bambooData = await getBambooData();
        const orgData = await getOrgData();

        const employees = mergeBambooDataAndOrgData(bambooData, orgData);

        const columns = employees.map(e => {
            return [
                e.firstName,
                e.lastName,
                e.email,
                e.department,
                ...e.managers.map(m => `${m.name}`).reverse()
            ].join(',')
        })

        const header = ["Firstname", "Lastname", "email", "Department", ...Array(10).fill(null).map((_, i) => "Manager " + i)].join(',');

        await exportResults([header, ...columns].join("\n"))


    } catch (e) {

        hideOverlay(overlay);
        const htmlDivElement = showErrorOverlay();
        setTimeout(() => hideOverlay(htmlDivElement), 2000)
    }
    hideOverlay(overlay);
})();


async function getBambooData() {
    return (await axios.get('https://backbase.bamboohr.com/employee_directory/ajax/get_directory_info')).data;
}


async function getOrgData() {
    const orgData = (await axios.get('https://backbase.bamboohr.com/employees/orgchart.php?pin')).data;
    let scriptTag = new RegExp('<script type="application/json" id="orgchart__data_json">((.|\\n)*)</script>').exec(orgData);

    let orgTree = JSON.parse(scriptTag[1].split('</script>')[0]);

    const linkedOrgChart = transformToDoubleLinkedListAndReturnAllElements(orgTree.OrgChart);
    return linkedOrgChart;
}

function transformToDoubleLinkedListAndReturnAllElements(tree) {
    const flat = [tree]
    const directReports = tree.directReports || [];
    for (let directReport of directReports) {
        directReport.parent = tree;
        flat.push(...transformToDoubleLinkedListAndReturnAllElements(directReport))
    }
    return flat;
}

function mergeBambooDataAndOrgData(bambooData, orgData) {
    const orgDataPerId = orgData.reduce((map, e) => {
        map.set(parseInt(e.id), e);
        return map;
    }, new Map());
    return bambooData.employees.map(e => {
        const employeeInOrgChart = orgDataPerId.get(e.id);
        return {
            ...e,
            ...employeeInOrgChart,
            managers: getManagers(employeeInOrgChart)
        }
    })
}

function getManagers(employee) {
    const managers = [];
    while (employee && employee.parent && employee.parent.id) {
        managers.push(employee.parent);
        employee = employee.parent;
    }
    return managers;
}

async function exportResults(data) {
    var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, 'employees-with-all-managers.csv');
}

function showOverlay() {
    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '9999';

    // Create the loader element
    const loader = document.createElement('div');
    loader.style.position = 'absolute';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.border = '4px solid #f3f3f3';
    loader.style.borderTop = '4px solid #3498db';
    loader.style.borderRadius = '50%';
    loader.style.width = '50px';
    loader.style.height = '50px';
    loader.style.animation = 'spin 2s linear infinite';

    // Create the keyframes for the loading animation
    const keyframes = document.createElement('style');
    keyframes.innerHTML = `
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;

    // Append the loader and keyframes to the overlay
    overlay.appendChild(loader);
    overlay.appendChild(keyframes);

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Display the overlay
    overlay.style.display = 'block';

    return overlay
}

function showErrorOverlay() {
    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '9999';

    // Create the loader element
    const loader = document.createElement('div');
    loader.style.position = 'absolute';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.fontSize = '10em';
    loader.innerText = '⚠️';


    // Append the loader and keyframes to the overlay
    overlay.appendChild(loader);

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Display the overlay
    overlay.style.display = 'block';

    return overlay
}

// Function to hide and remove the overlay
function hideOverlay(overlay) {
    if (overlay) {
        document.body.removeChild(overlay);
    }
}
