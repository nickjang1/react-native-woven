export default class Character {
  constructor(json) {
    this.name            = json.name;
    this.profiles        = this._socialNetworkUsernamesMap(json.social_networks);
    this.avatar          = json.avatar_url;
    this.biography       = json.biography;
    this.location        = json.location;
    this.profile_link    = json.profile_link;

    this.social_networks = this._socialNetworks(json.social_networks);
  }

  // PRIVATE
  _socialNetworks(socialNetworks) {
    let networks = [];

    socialNetworks.map((social) => {
      networks.push(social);
    });

    return networks;
  }
  _socialNetworkUsernamesMap(networks) {
    let map = {};
   const network = networks[0]; // ToDo : Properly iterate over that array.
    // for (network in networks) {
      const kind = network["kind"];
      const username = network["username"];

      map[kind] = username;
    // }
    return map;
  }

}
