package com.momo.post.entity;

import com.momo.category.entity.Category;
import com.momo.comment.entity.Comment;
import com.momo.member.entity.Member;
import com.momo.tagpost.entity.TagPost;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    private String title;
    private String content;

    private LocalDateTime createdAt;
    private LocalDateTime editedAt;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "post")
    private List<TagPost> tagPosts;

    @OneToMany(mappedBy = "post")
    private List<Comment> comments;


}