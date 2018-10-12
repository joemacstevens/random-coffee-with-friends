const base = "https://hbc-frontend-challenge.hbccommon.private.hbc.com/coffee-week/users"

const api = {
    ny: base + "?location=ny",
    dublin: base + "?location=db"
}

let indexByLocation = function(team) {

    let nyTeam = team.filter(function(nyer){
        return nyer.location === "ny"
    })

    let dbTeam = team.filter(function(dber){
        return dber.location === "dub"
    })

    return [nyTeam,dbTeam]
}

Vue.component('team-member', {
    props:["user"],
    template: '<h2>{{user.name}}</h2>'
})


let app = new Vue({
    el: "#app",
    data: {
        message: "Coffee With Friends",
        errored: false,
        loading: true,
        team: null,
        ny: null,
        dub: null
    },
    mounted() {
        axios
            .get(base)
            .then(response => {
                this.team = response.data.users
                let located = indexByLocation(response.data.users)
                this.ny = located[0]
                this.dub = located[1]
            })
            .catch(error => {
                this.errored = true
            })
            .finally(() => this.loading = false)
    },
    
})