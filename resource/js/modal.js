(function($) {
    var _freeze, _scrollBarPosition, _scrollBarWidth, methods;
    _scrollBarPosition = 0;
    _scrollBarWidth = 0;
    _freeze = false;
    methods = {
      init: function(options) {
        if ($('body').css('position') !== 'fixed') {
          _scrollBarPosition = $(document).scrollTop();
        }
        _scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        _freeze = options.freeze;
        methods.create(options.name, options.size, options.title, options.content, options.callback);
      },
      create: function(name, size, title, content, callback) {
        var modal;
        modal = methods.template(name, size, title, content);
        if (_freeze && $('body').css('position') !== 'fixed') {
          methods.freeze(true);
        }
        $('body').append(modal).ready(function() {
          if (callback) {
            callback();
          }
        });
        methods.binding(name);
      },
      isInteger: function(size) {
        if (size === parseInt(size, 10)) {
          return true;
        } else {
          return false;
        }
      },
      template: function(name, size, title, content) {
        var box;
        if (methods.isInteger(size)) {
          box = '<div class="simple-modal-box" style="max-width: ' + size + 'px;">';
        } else {
          box = '<div class="simple-modal-box simple-modal-box--' + size + '">';
        }
        return "<div class=\"simple-modal simple-modal--" + name + "\">\n	<div class=\"simple-modal__container\">\n		<div class=\"simple-modal__middle\">\n			<div class=\"simple-modal__box\">\n				" + box + "\n					<div class=\"simple-modal-box__header\">\n						<div class=\"simple-modal-box__title\">" + title + "</div>\n						<button class=\"simple-modal-box__close\" type=\"button\"></button>\n					</div>\n					<div class=\"simple-modal-box__content\">" + content + "</div>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>";
      },
      binding: function(name) {
        $(".simple-modal--" + name + " .simple-modal-box__close").click(function() {
          methods.close(name);
        });
        $(".simple-modal--" + name + " .simple-modal__container").mousedown(function(e) {
          if (!e.target.closest('.simple-modal-box')) {
            methods.close(name);
          }
        });
      },
      freeze: function(state) {
        if (state) {
          $('body').css('top', "-" + _scrollBarPosition + "px").css('position', 'fixed').css('width', '100%');
          if ($('html').hasClass('no-touch')) {
            $('body').css('padding-right', _scrollBarWidth);
          }
        } else {
          $('body').css('top', 'auto').css('position', 'relative').css('padding-right', '');
          $(document).scrollTop(_scrollBarPosition);
        }
      },
      close: function(name) {
        $(".simple-modal--" + name).remove();
        if (_freeze && $('.simple-modal').length === 0) {
          methods.freeze(false);
        }
      }
    };
    jQuery.fn.simpleModal = function(options) {
      options = $.extend({
        name: '',
        title: '',
        content: '',
        size: 'small',
        freeze: true
      }, options);
      methods.init(options);
      return methods;
    };
  })(jQuery);