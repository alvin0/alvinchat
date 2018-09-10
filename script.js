var config = {
  apiKey: "AIzaSyCiBQ9r-amCjzx9OMhGrFMOnhM55yajdaI",
  authDomain: "chat-js-demo.firebaseapp.com",
  databaseURL: "https://chat-js-demo.firebaseio.com",
  projectId: "chat-js-demo",
  storageBucket: "chat-js-demo.appspot.com",
  messagingSenderId: "1065766480064"
};
firebase.initializeApp(config);
var database = firebase.database();
var vueapp = new Vue({
  el: '#app',
  data: {
  	chat_room :'All',
  	new_room:'',
  	user_name :'',
   	messageInput : '',
   	dbFirebaseMessage :[],
   	dbFirebaseRoomMessage :[],
    testchange:[],
   	status:false,
  },
	firebase: {
    dbFirebaseMessage : database.ref('chats/All'),
    testchange : database.ref('chats'),
    dbFirebaseRoomMessage : database.ref('chats')
  },
  updated:function(){
		this.scrollToEnd();
  },
  watch:{
  	testchange:function(){
      this.fetchDataRoom()
  	}
  },
  filters: {
	  moment: function (date) {
	    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
	  }
	},
  methods:{
  	pushMessageChat : function(){
  		database.ref('chats/'+this.chat_room).push(
  			{
  				user_name:this.user_name,
  				message:this.messageInput,
  				created_at: firebase.database.ServerValue.TIMESTAMP
  			}
		);
		this.messageInput='';
    	this.fetchDataRoom()
		this.scrollToEnd();
  	},
	scrollToEnd: function () {
		if(this.status)
		{
	        var msg_history = this.$el.querySelector('.msg_history')
	        msg_history.scrollTop = msg_history.scrollHeight
		}
    },
    startChat:function(){
    	if(this.user_name != '')
    	{
    		this.status = true;
    	}
    },
    fetchDataRoom:function(){
    	var $this = this;
    	database.ref('/chats/'+this.chat_room).once('value',function(snapshot){
    		$this.dbFirebaseMessage = snapshot.val()
		})
    },
    changeRoom:function(id){
    	this.chat_room = id;
      this.$firebaseRefs.dbFirebaseMessage = database.ref('chats/'+this.chat_room);
    	this.fetchDataRoom()
    },
    createNewRoom:function(){
    	if(this.new_room != '') {
	    	database.ref('chats/'+this.new_room).push(
	  			{
	  				user_name:this.user_name,
	  				message:'hello',
	  				created_at: firebase.database.ServerValue.TIMESTAMP
	  			}
			);
			this.messageInput='';
			this.chat_room = this.new_room;
			this.changeRoom(this.chat_room);
			this.new_room = '';
			this.scrollToEnd();
    	}
    }

  }
})