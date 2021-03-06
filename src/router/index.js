/**
 * This file contains all routes inside streak application.
 */
import Vue from 'vue';
import Router from 'vue-router';
import UserPage from '../components/UserPage.vue';
import AddRecordContainer from '../components/AddRecordContainer.vue';
import NewProject from '../components/NewProject.vue';
import ProjectPage from '../components/ProjectPage.vue';
import AboutPage from '../components/AboutPage.vue';
import ProjectOverview from '../components/ProjectOverview.vue';
import ProjectSettings from '../components/settings/ProjectSettings.vue';
import ExplorerPage from '../components/ExplorerPage.vue';
import ProjectDiscussions from '../components/comments/ProjectDiscussions.vue';
import StartDiscussion from '../components/comments/StartDiscussion.vue';
import CommentDetails from '../components/comments/CommentDetails.vue';

Vue.use(Router);

export default new Router({
  routes: [{
    // By default I want people to go to the user page. This might be changed
    // in future
    path: '/',
    name: 'redirectToUser',
  }, {
    path: '/about',
    name: 'about',
    component: AboutPage,
  }, {
    path: '/new-project',
    name: 'new-project',
    component: NewProject
  }, {
    path: '/explore',
    name: 'explore',
    component: ExplorerPage
  }, {
    path: '/:userId',
    name: 'userPage',
    component: UserPage,
    props: true
  }, {
    path: '/:userId/project/:projectId',
    component: UserPage,
    props: true,
    children: [{
      path: '',
      component: ProjectPage,
      props: true,
      children: [{
        path: '',
        name: 'project-overview',
        props: true,
        component: ProjectOverview
      }, {
        path: 'settings',
        name: 'project-settings',
        props: true,
        component: ProjectSettings
      }, {
        path: 'discuss',
        name: 'project-discussion',
        props: true,
        component: ProjectDiscussions
      }, {
        path: 'discuss/:commentId',
        name: 'comment-details',
        props: true,
        component: CommentDetails
      }, {
        path: 'discuss/add',
        name: 'add-comment',
        props: true,
        component: StartDiscussion
      }, {
        path: 'add',
        name: 'add-record',
        component: AddRecordContainer,
        props: true
      }, {
        path: 'edit-record/:row',
        name: 'edit-record',
        component: AddRecordContainer,
        props: true
      }]
    }]
  }],
});
