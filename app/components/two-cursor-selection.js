import Ember from 'ember';

export default Ember.Component.extend({
  tag:'div',
  cursor1SpanId:1,
  cursor2SpanId:1,
  didInsertElement: function(){
      this.enableCursorDrag();
  },
  /* Computer property which splits the entire string of input data into array of characters */
  setupComponent: function(){
    var textData=this.get('textData');
    var dragId="drag"+textData.dataId;
    this.set('dragId',dragId);
    var textString=textData.dataValue;
    var charArray=textString.split("");
    var newArray=[];
    for(var i=0; i<charArray.length; i++){
      var newObject={};
      newObject.data=charArray[i];
      newObject.spanId=dragId+(i+1);
      newArray.push(newObject);
    }
    this.set('cursor1Id',"cursor1"+dragId);
    this.set('cursor2Id',"cursor2"+dragId);
    this.set('currentContainmentId',"cursor-blk-"+dragId);
    this.set('span0Id',(dragId+"0"));
    this.set('draggableId',"draggable"+dragId);
    this.set('totalText',newArray)
  }.observes('textData').on('init'),

  /*Method called when the cursor is dragged over the characters */
  sortMethod:function (input) {
    var component= this;
    var replacedSpanId= input.placeholder[0].previousElementSibling.id;
    if(!Ember.isEmpty(replacedSpanId)){
      var dragId=component.get('dragId');
      $("#"+dragId).find('.text-sort-disabled').removeClass("cursor-selection");
      component.set('counter',this.get('counter')+1);
      var cursorId=input.item[0].id;
      var newSpanId= parseInt(replacedSpanId.slice(dragId.length));
      var cursor1Id=component.get('cursor1Id');
      var cursor2Id=component.get('cursor2Id');
      if(cursorId==cursor1Id){
        component.set("cursor1SpanId",newSpanId);
      }else if(cursorId==cursor2Id){
        component.set("cursor2SpanId",newSpanId);
      }
      var cursor1SpanId=component.get('cursor1SpanId');
      var cursor2SpanId=component.get('cursor2SpanId');
      if(cursor1SpanId<cursor2SpanId){
        $("#"+dragId+(cursor1SpanId)).nextUntil("#"+dragId+(cursor2SpanId+1)).not(".cursor").addClass("cursor-selection");
      }else  if(cursor1SpanId>cursor2SpanId){
        $("#"+dragId+(cursor2SpanId)).nextUntil("#"+dragId+(cursor1SpanId+1)).not(".cursor").addClass("cursor-selection");
      }
    }
  },
  /* Method called when the cursor is dropped in a new and valid position */
  sortingDoneMethod:function(event,ui){
    var component=this;
    var dragId=component.get('dragId');
    var cursor1SpanId=component.get('cursor1SpanId');
    var cursor2SpanId=component.get('cursor2SpanId');
    var draggableId=this.get('draggableId');
    if(cursor1SpanId<cursor2SpanId){
        var cellDataForDrop="id= '"+draggableId+"' ";
        $("#"+dragId+(cursor1SpanId)).nextUntil("#"+dragId+(cursor2SpanId+1)).not(".cursor").wrapAll('<div '+cellDataForDrop+' />');
    }
    else if(cursor1SpanId>cursor2SpanId){
      var cellDataForDrop="id= '"+draggableId+"' ";
        $("#"+dragId+(cursor2SpanId)).nextUntil("#"+dragId+(cursor1SpanId+1)).not(".cursor").wrapAll('<div '+cellDataForDrop+' />');
    }
    var $dragComponent= $('#'+draggableId);
    $dragComponent.addClass('draggable-selection-text');
    $dragComponent.draggable({
        drag:function(event,ui){
          ui.helper.css("display","flex");
        },
        cursor:"pointer",
        revert:true,
        helper:"clone"
    });
  },

  /*Method called when the cursor drag is started */
  sortingStartMethod:function(event,ui){
    var component=this;
    var dragId=component.get('dragId');
    var draggableId=component.get('draggableId');
    var $dragComponent=$('#'+draggableId);
    if($($dragComponent).length){
        $dragComponent.draggable("destroy");
        $dragComponent.children().first().unwrap();
        var $sortableList= $('#'+dragId);
        $sortableList.sortable("refresh");
    }
  },

  enableCursorDrag:function(){
    var component=this;
    var currentContainmentId=this.get('currentContainmentId');
    var dragId=component.get('dragId');
    var $sortableList=$('#'+dragId);
    $sortableList.sortable({
      cancel:"text-sort-disabled",
      containment: "#"+currentContainmentId,
      snap:true,
      snapMode:"inner",
      change:function(event,ui){
          component.sortMethod(ui);
      },
      deactivate:function(event,ui){
          component.sortingDoneMethod(event,ui);
      },
      activate:function(event,ui){
        component.sortingStartMethod(event,ui);
      }
    })
  }
});
