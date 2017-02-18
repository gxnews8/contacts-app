// 8/ decided to handle favorites differently half-way through the course 😂
const initialState = {
  contacts: [
    {name: 'Albert Einstein', planet: 'Earth'}, {name: 'Steve Jobs', planet: 'Earth'},
    {name: 'Bob the Builder', planet: 'Earth'}, {name: 'Superman', planet: 'Krypton'},
    {name: 'Optimus Prime', planet: 'Cybertron'}
  ],
  favorites: [],
  filters: {onlyEarth: false, search: ''}
}

function reducer(state = initialState, action) {
  switch (action.type) {
  case 'SET_FILTER':
    return Object.assign({}, state, { filters: { onlyEarth: action.value, search: state.filters.search }})
  case 'SET_SEARCH':
    return Object.assign({}, state, { filters: { onlyEarth: state.filters.onlyEarth, search: action.value }})
  // 5/ one of a dozen ways to handle this. not recommended for production
  case 'ADD_FAVORITE':
    console.log(action)
    return Object.assign({}, state, {
      favorites: state.favorites.concat(action.contact)
    });
  default:
    return state;
  }
}

const store = Redux.createStore(reducer);

const Contact = ({name}) => <div>{name}</div>

const FavoriteList = ({contacts}) => (
  <div>
    <h2>Favorites</h2>
    {contacts.map(contact => <Contact name={contact.name} key={contact.name}/>)}
  </div>
)

class ContactList extends React.Component {
  handleChange = (event) => this.props.setEarthFilter(event.target.checked);
  setSearch = (event) => this.props.setSearch(event.target.value);
  // add handler for favoriting a contact
  addFavorite = (contact) => this.props.addFavorite(contact);

  render() {
    const search = this.props.filters.search;
    const matchSearch = this.props.contacts.filter(contact => {
      return contact.name.toLowerCase().includes(search.toLowerCase());
    });

    const sorted = matchSearch.sort((a, b) => a.name > b.name);
    const filtered = sorted.filter(contact => {
      if (this.props.filters.onlyEarth) {
        return contact.planet === 'Earth' ? true : false;
      } else {
        return true;
      }
    })

    return (
      <div>
        <h2>Contacts List</h2>
        Search: 
        <input type="text" value={this.props.filters.search} onChange={this.setSearch} />
        <br />
        <input type="checkbox" checked={this.props.filters.onlyEarth} onChange={this.handleChange}/>
        Only Earth
        {

          // 4/ wrap Contact in an anchor and add a click handler
          filtered.map(contact => (
          <a href="#" onClick={this.addFavorite.bind(null, contact)} key={contact.name}>
            <Contact name={contact.name}/>
          </a>
        ))}
        {`${filtered.length} shown, ${this.props.contacts.length - filtered.length} hidden`}
      </div>
    );
  }
}

const App = () => (
  <div>
    // pass the addFavorite redux action into the ContactList
    <ContactList
      contacts={store.getState().contacts}
      filters={store.getState().filters}
      setEarthFilter={onlyEarth => store.dispatch({type: 'SET_FILTER', value: onlyEarth})}
      setSearch={text => store.dispatch({type: 'SET_SEARCH', value: text})}
      addFavorite={contact => store.dispatch({type: 'ADD_FAVORITE', contact})}
    />
    <FavoriteList contacts={store.getState().favorites}/>
  </div>
);

store.subscribe(() => {ReactDOM.render(<App />, document.getElementById('root'))});
store.dispatch({type:'START'});