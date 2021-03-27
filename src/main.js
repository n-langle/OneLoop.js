import assign from './function/assign';
import easings from './object/easings';
import MainLoop from './class/MainLoop';
import MainLoopEntry from './class/MainLoopEntry';
import Tween from './class/Tween';
import ScrollObserver from './class/ScrollObserver';
import ScrollObserverEntry from './class/ScrollObserverEntry';
import ThrottledEvent from './class/ThrottledEvent';

var main = {
	easings: easings,
	MainLoop: MainLoop,
	MainLoopEntry: MainLoopEntry,
	Tween: Tween,
	ScrollObserver: ScrollObserver,
	ScrollObserverEntry: ScrollObserverEntry,
	ThrottledEvent: ThrottledEvent
};

assign(window, main);
