(function() {

	window.App = {
		Models: {},
		Collections: {},
		Views: {}
	};

	window.template = function(id){
		//console.log($('#' + id).html() )
		return _.template( $('#' + id).html() );
	};


	//Declare models
	App.Models.Task = Backbone.Model.extend({

		validate: function(attrs){
			if ( ! $.trim( attrs.title  ) ) {
				return 'A task requires a valid title';
			}
		}   

	});

	App.Collections.Tasks = Backbone.Collection.extend({
		model: App.Models.Task
	});

	App.Views.Tasks = Backbone.View.extend({
		tagName: 'ul',

		initialize: function(){
			this.collection.on('add', this.addOne, this);
		},

		render: function(){
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function(task){
			var taskView = new App.Views.Task({model: task});
			this.$el.append(taskView.render().el);
		}
	});

	App.Views.Task	= Backbone.View.extend({

		initialize: function(){
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		tagName: 'li',
		 
		template: template('task-template'),

		events: { 
			'click .edit': 'edit',
			'click .delete': 'destroy',
		},

		edit: function(){
			var newtaskTitle = prompt('What would you like to change the text to?', this.model.get('title'));
			if( !newtaskTitle ) return;
			this.model.set('title', newtaskTitle, {validate:true});
		},

		destroy: function(){
			this.model.destroy();
		},

		remove: function(){
			this.$el.remove();
		},

		render: function(){
			var template = this.template( this.model.toJSON() );
			this.$el.html( template );
			return this; 
		}
	});

	App.Views.AddTask = Backbone.View.extend({

		el: '#addTask',

		events: {
			'submit': 'submit'
		},

		submit: function(e){
			console.log(1);
			e.preventDefault();

			var newTaskTitle = $(e.currentTarget).find('input[type=text]').val();
			var task = new App.Models.Task({ title: newTaskTitle });
			
			this.collection.add(task);
		}
	});

	var tasks = new App.Collections.Tasks([
		{
			title: 'Go to store',
			priority: 4 
		},
		{
			title: 'Go to the mall',
			priority: 3
		},
		{
			title: 'Go to work',
			priority: 5
		}
	]);

	var addTaskView = new App.Views.AddTask({ collection: tasks });

	var tasksView = new App.Views.Tasks({ collection: tasks });

	$('.tasks').html( tasksView.render().el );

})();