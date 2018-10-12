const base = "https://hbc-frontend-challenge.hbccommon.private.hbc.com/coffee-week/users"

const api = {
    ny: base + "?location=ny",
    dublin: base + "?location=db"
}

let indexByLocation = function(team) {


    let nyTeam = team.filter(function(nyer,i){
        nyer.image = "images/" + (i + 1 )+ ".png"
        return nyer.location === "ny"
    })

    let dbTeam = team.filter(function(dber,i){
        dber.image = "images/" + (i + 1 ) + ".png"
        return dber.location === "dub"
    })

    return [nyTeam,dbTeam]
}

let getRandomPairings = function(users){
    
    let splitAt = function(i, xs) {
        let a = xs.slice(0, i);
        let b = xs.slice(i, xs.length);
        return [a, b];
      };
      
     let shuffle = function(xs) {
        return xs.slice(0).sort(function() {
          return .5 - Math.random();
        });
      };
      
      let zip = function(xs) {
        return xs[0].map(function(_,i) {
          return xs.map(function(x) {
            return x[i];
          });
        });
      }

      let userids = users.map(function(user){
          return user.guid
      })

     let pairedids = zip(splitAt(userids.length/2, shuffle(userids)));

     let teams = pairedids.map(function(userids){
         return userids.map(function(userid){
            let teammate    
            users.forEach(element => {
                    if(element.guid === userid){
                        teammate = element
                    }
                });
            return teammate
         })
     })

    return teams
      
}

Vue.component('team-member', {
    props:["name","last","image","department"],
    template: '<div class="teammate"><p class="name">{{name}} {{last}}</p><img :src="image" class="pic"><p class="department">{{department}}</p></div>'
})

Vue.component('work-teams', {
    props:["team-members"],
    template: `<div>
        <team-member class="teammates" 
        v-for="person in teamMembers" 
        v-bind:name="person.name.first"
        v-bind:last="person.name.last"
        v-bind:department="person.department"
        v-bind:image="person.image"></team-member>
    </div>`
})

let app = new Vue({
    el: "#app",
    data: {
        message: "Coffee With Friends",
        errored: false,
        loading: true,
        office: null,
        teams: null,
        ny: null,
        dub: null
    },
    methods: {
        generate_ny: function(event){
            this.teams = getRandomPairings(this.ny)
            this.office = "New York"
        },
        generate_dub: function(event){
            this.teams = getRandomPairings(this.dub)
            this.office = "Dublin"
        }
    },
    mounted() {
        axios
            .get(base)
            .then(response => {
                let located = indexByLocation(response.data.users)
                this.ny = located[0]
                this.dub = located[1]
            })
            .catch(error => {
                this.errored = true
            })
            .finally(() => this.loading = false)
    }
    
})