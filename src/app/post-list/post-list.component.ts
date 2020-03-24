import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../auth/auth.service';




@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  constructor(public postsService : PostsService, private authService: AuthService) { }

  posts: Post[] = [];
  totalPosts = 10;
  postsPerpage = 4;
  currentPage = 1;
  pageSizeOptions = [1, 2, 3, 4, 5, ,7, 8,10];
  userIsAuthenticated = false;
  private postSub: Subscription;
  private authStatusSub: Subscription;
  isLoading = false;
  userId: string;

  deleteValue(){
  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerpage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postsService
      .getPostUpdateListiner()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated; // get value from service
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1; // index 0-s eheldeg, harin backend 1-s eheldeg bolohoor 1iig nemj uguj bgaa
    this.postsPerpage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerpage, this.currentPage);
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postsService.deletePosts(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerpage, this.currentPage);
      }, () => {
        this.isLoading = false;
      });
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
