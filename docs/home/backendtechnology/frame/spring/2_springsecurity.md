---
title : SpringSecurity原理(JWT)
---

## 作用
用户是否存在，是否被锁定等等等；

全部认证成功后会调用 AuthenticationSuccess 成功处理类，失败则调用 AuthenticationFailHandler 类

此时对于前后端分离项目而言，调用成功处理类，通常是返回由 JWT 等生成的 token json 字符串，前台拿到返回信息后，
保存 token 致本地，然后每次请求都会拼接到 head 中。


## 原理（源码级别结合JWT案例）
::: warning 小提示
SpringSecurity 首先要从 <code>AbstractAuthenticationProcessingFilter</code>开始**深入**
:::
* 输入用户名、密码后点击登录按钮，首先进入 UsernamePassworkAuthenticationFilter 的父类， AbstractAuthenticationProcessingFilter 调用 doFilter() 方法

```java   
public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        
        //1.判断当前filter是否可以处理当前请求，如果不可以的则交给下一个filter处理
        //该判断不需要自己处理，springSecurity 提供了很多 "RequestMatcher" 会自动匹配判断
        //也可以自定义匹配规则
        if (!requiresAuthentication(request, response)) {
            chain.doFilter(request, response);
            return;
        }
        if (logger.isDebugEnabled()) {
        
            //开始授权认证请求
            logger.debug("Request is to process authentication");
        }
        Authentication authResult;
        try {
            //2.调用具体filter 的认证方法 attemptAuthentication （JwtFilter 或者  UsernamePasswordAuthenticationFilter 等等;可以自定义过滤器，通过继承AbstractAuthenticationProcessingFilter 实现相应方法 ）
            authResult = attemptAuthentication(request, response);
            if (authResult == null) {
                //认证失败，直接返回
                return;
            }
            
            //3.认证成功后处理一些session相关的方法
            //这里可以选择不同的SessionStrategy处理策略 "SessionAuthenticationStrategy"
            sessionStrategy.onAuthentication(authResult, request, response);
        } catch (InternalAuthenticationServiceException failed) {
            logger.error(
                    "An internal error occurred while trying to authenticate the user.",
                    failed);
            //4.认证失败后的一些操作
            unsuccessfulAuthentication(request, response, failed);
            return;
        } catch (AuthenticationException failed) {
            // Authentication failed
            unsuccessfulAuthentication(request, response, failed);
            return;
        }
        // Authentication success
        if (continueChainBeforeSuccessfulAuthentication) {
            chain.doFilter(request, response);
        }
        //5.认证成功后， 主要将当前认证的方法放到SecurityContextHolder中
        //集成JWT中这里可以设置，子类JwtFilter 重写此方法，实现自定义的成功认证回调
        successfulAuthentication(request, response, chain, authResult);
    }

```
* 自定义匹配规则

```java 
@Component
public class SkipPathRequestMatcher implements RequestMatcher {

    private OrRequestMatcher matchers;

    private RequestMatcher processingMatcher;

    private static List<String> pathsToSkip = Arrays.asList("/api/v1/user/**");

    private static String processingPath = "/api/v1/**";

    public SkipPathRequestMatcher() {
        List<RequestMatcher> m = pathsToSkip.stream().map(path -> new AntPathRequestMatcher(path)).collect(Collectors.toList());
        matchers = new OrRequestMatcher(m);
        processingMatcher = new AntPathRequestMatcher(processingPath);
    }

    @Override
    public boolean matches(HttpServletRequest request) {
        if (matchers.matches(request)) {
            return false;
        }
        return processingMatcher.matches(request) ? true : false;
    }
}
```
### 自定义 RequestMatcher 使用方法，这里演示在自定义JwtFilter中的使用
```java  
 public JwtAuthenticationFilter(RequestMatcher skipPathRequestMatcher) {
        super(skipPathRequestMatcher);
        setAuthenticationManager(authentication -> authentication);
    }
```

* 自定义的JwtFilter 实现 <code>AbstractAuthenticationProcessingFilter</code>

::: tip 小提示
 在SpringSecurity中可以有很多个过滤链， 通过<code> chain.doFilter(request, response)</code> 将过滤链下发到下面的过滤连
 可以自定义N个过滤链（如果你不嫌太复杂的话）
:::
可以设置 基本过滤连（java面向对象的一种编程思想）
```java  
public abstract class BaseSecurityFilter extends AbstractAuthenticationProcessingFilter
```
```java  
@Component
public class JwtAuthenticationFilter extends BaseSecurityFilter {
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String JWT_HEADER = "Authorization";
    private static final String JWT_BEARER = "bearer ";
    private static final String JWT_BEARER_UPPER = "Bearer ";
    private static final String JWT_REFRESH_TOKEN = "refreshToken";
    @Resource
    private JwtUtil jwtUtil;
    @Resource
    private CommonConfig commonConfig;
    @Resource
    private UserServiceEx userServiceEx;


    //这里的意思是： 当前过滤器 过滤的请求路径，如果想更加灵活的定制过滤路径，上面已经介绍了 "自定义匹配规则"    
    public JwtAuthenticationFilter() {
        super(CommonConstants.Security.INTERNAL_ALL);//在本项目中默认过滤 /api/v1  所有的路径
    }

    @Override
    public void afterPropertiesSet() {
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        String header = request.getHeader(JWT_HEADER);
        if (header == null || !(header.startsWith(JWT_BEARER_UPPER) || header.startsWith(JWT_BEARER))) {
            throw new AuthenticationCredentialsNotFoundException("No JWT token found in request headers");
        }
        String authToken = header.substring(7);
        if (StringUtils.isBlank(authToken)) {
            throw new AuthenticationCredentialsNotFoundException("Empty Bearer token");
        }
        //该方法中通过 请求tocken 实例化一个 UsernamePasswordAuthenticationToken 的对象， 作用是将用户请求的信息（用户名、密码、seeesion等）封装到该对象中
        //如果是UsernamePasswordAuthenticationFilter, 是通过用户名和密码封装UsernamePasswordAuthenticationToken对象
        JwtAuthenticationToken authRequest = new JwtAuthenticationToken(authToken);
        setDetails(request, authRequest);
        
        //这里调用的是 ProviderManager的 的authenticate 方法，进行具体的权限认证
        return this.getAuthenticationManager().authenticate(authRequest);
    }
    //设置认证细节，将请求绑定权限认证源
    private void setDetails(HttpServletRequest request, UsernamePasswordAuthenticationToken authRequest) {
        authRequest.setDetails(authenticationDetailsSource.buildDetails(request));
    }

    //自定义的认证成功回调
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        super.successfulAuthentication(request, response, chain, authResult);

        // As this authentication is in HTTP header, after success we need to continue
        // the request normally
        // and return the response as if the resource was not secured at all
        try {
            JwtUser jwtUser = (JwtUser) authResult.getPrincipal();
            if (null != jwtUser) {
                DefaultClaims claims = jwtUser.getDefaultClaims();
                if (claims.getExpiration().getTime() - System.currentTimeMillis()
                        <= commonConfig.getJwt().getRefreshSecond() * 1000) {
                    String newToken = jwtUtil.generateToken(jwtUser.getUsername(), jwtUser.getUserId());
                    response.setHeader("Access-Control-Expose-Headers", JWT_REFRESH_TOKEN);
                    response.setHeader(JWT_REFRESH_TOKEN, newToken);
                    User user = new User();
                    user.setId(jwtUser.getUserId());
                    user.setJwtToken(newToken);
                    userServiceEx.updateByPrimaryKeySelective(user);
                    LOGGER.debug("refreshToken: {}", newToken);
                }
//                super.setContinueChainBeforeSuccessfulAuthentication(true);
            }
        } catch (Exception e) {
            LOGGER.error("Parse JwtUser error.", e);
        }
        chain.doFilter(request, response);
    }

    //自定义的认证失败回调
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        super.unsuccessfulAuthentication(request, response, failed);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
}

```
::: danger 注意
如果你想让某一请求路径不被拦截，那么你需要在 继承自<code>WebSecurityConfigurerAdapter</code>的 SecurityConfig 类中的
<code>configure(HttpSecurity http)</code>方法中解锁请求，例如： <code> .and().authorizeRequests().antMatchers("/api/v1/activitiService/**").permitAll()</code>。
并且！ 还要在你自定义的<code>filter</code>中 也解锁 该请求路径
例如： <code>pathsToSkip = Arrays.asList("/api/v1/activitiService/\**");</code>（这里使用的自定义匹配规则）

:::

* 看一下封装 UsernamePasswordAuthenticationToken 对象的过程
> 这里是JwtAuthenticationToken 继承了 UsernamePasswordAuthenticationToken
```java  
public class JwtAuthenticationToken extends UsernamePasswordAuthenticationToken {
    private static final long serialVersionUId = 1L;
    private static final String PRINCIPAL_JWT = "PRINCIPAL_JWT";

    private String token;

    public JwtAuthenticationToken(String token) {
        super(PRINCIPAL_JWT, token);
        this.token = token;
    }
    public String getToken() {
        return token;
    }
}
```
看一下 UsernamePasswordAuthenticationToken 具体怎么封装
```java  
public class UsernamePasswordAuthenticationToken extends AbstractAuthenticationToken {
    private static final long serialVersionUID = 500L;
    private final Object principal;
    private Object credentials;

    public UsernamePasswordAuthenticationToken(Object principal, Object credentials) {
        super((Collection)null);
        this.principal = principal;
        this.credentials = credentials;
        this.setAuthenticated(false);
    }
```
需要说明一点的是，super((Collection)null); collection 代表权限列表，在这传了一个 null 进去是因为刚开始并没有进行认证，因此用户此时没有任何权限，并且设置没有认证的信息 setAuthenticated(false)

* 再回到 JwtAuthenticationFilter attemptAuthentication() 方法，可以看到方法最后调用了 getAuthenticationManager() 方法，然后就进入了 AuthenticationManager 接口的实现类 ProviderManager 中。 

在权限认证Manager中的执行过程如下(<code>ProviderManager.java</code>):
``` java  
public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Class<? extends Authentication> toTest = authentication.getClass();
        AuthenticationException lastException = null;
        Authentication result = null;
        boolean debug = logger.isDebugEnabled();
        //遍历所有的认证Providers => 继承自 AbstractUserDetailsAuthenticationProvider 抽象类的 Provider
        //通过不同的Provider去进行具体的权限认证
        //例如 JwtAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider ， 自定义的Jwt权限认证Provider
        Iterator var6 = this.getProviders().iterator();

        while(var6.hasNext()) {
            AuthenticationProvider provider = (AuthenticationProvider)var6.next();
            if (provider.supports(toTest)) {//这里在 JwtAuthenticationProvider 中要提供具体的 supports 方法，下文会提到。
                if (debug) {
                    logger.debug("Authentication attempt using " + provider.getClass().getName());
                }

                try {
                    //进行具体的权限认证，内部会调用 自定义Provider 的 retrieveUser方法
                    //这里看你自定义的Provider实现的是哪个父类，在Jwt中实现的是 AbstractUserDetailsAuthenticationProvider
                    //所以默认会走AbstractUserDetailsAuthenticationProvider 的authenticate方法
                    result = provider.authenticate(authentication);
                    if (result != null) {
                        this.copyDetails(authentication, result);
                        break;
                    }
                } catch (AccountStatusException var11) {
                    this.prepareException(var11, authentication);
                    throw var11;
                } catch (InternalAuthenticationServiceException var12) {
                    this.prepareException(var12, authentication);
                    throw var12;
                } catch (AuthenticationException var13) {
                    lastException = var13;
                }
            }
        }

        if (result == null && this.parent != null) {
            try {
                result = this.parent.authenticate(authentication);
            } catch (ProviderNotFoundException var9) {
                ;
            } catch (AuthenticationException var10) {
                lastException = var10;
            }
        }

        if (result != null) {
            if (this.eraseCredentialsAfterAuthentication && result instanceof CredentialsContainer) {
                ((CredentialsContainer)result).eraseCredentials();
            }

            this.eventPublisher.publishAuthenticationSuccess(result);
            return result;
        } else {
            if (lastException == null) {
                lastException = new ProviderNotFoundException(this.messages.getMessage("ProviderManager.providerNotFound", new Object[]{toTest.getName()}, "No AuthenticationProvider found for {0}"));
            }

            this.prepareException((AuthenticationException)lastException, authentication);
            throw lastException;
        }
    }
```
* 在AbstractUserDetailsAuthenticationProvider 中进行具体的权限认证
```java  
public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Assert.isInstanceOf(UsernamePasswordAuthenticationToken.class, authentication, this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.onlySupports", "Only UsernamePasswordAuthenticationToken is supported"));
        String username = authentication.getPrincipal() == null ? "NONE_PROVIDED" : authentication.getName();
        boolean cacheWasUsed = true;
        UserDetails user = this.userCache.getUserFromCache(username);
        if (user == null) {
            cacheWasUsed = false;

            try {
                //调用用户自定义的Provider 的 retrieveUser方法，进行权限认证
               // 在这里 需要authentication 这个tocken，所以在 filter的 attemptAuthentication 中需要设置 JwtAuthenticationToken
                user = this.retrieveUser(username, (UsernamePasswordAuthenticationToken)authentication);
            } catch (UsernameNotFoundException var6) {
                this.logger.debug("User '" + username + "' not found");
                if (this.hideUserNotFoundExceptions) {
                    throw new BadCredentialsException(this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
                }

                throw var6;
            }
            
            Assert.notNull(user, "retrieveUser returned null - a violation of the interface contract");
        }

        try {
            //前置检查
            this.preAuthenticationChecks.check(user);
            //额外的检查
            this.additionalAuthenticationChecks(user, (UsernamePasswordAuthenticationToken)authentication);
        } catch (AuthenticationException var7) {
            if (!cacheWasUsed) {
                throw var7;
            }

            cacheWasUsed = false;
            user = this.retrieveUser(username, (UsernamePasswordAuthenticationToken)authentication);
            this.preAuthenticationChecks.check(user);
            this.additionalAuthenticationChecks(user, (UsernamePasswordAuthenticationToken)authentication);
        }
        //后置检查
        this.postAuthenticationChecks.check(user);
        if (!cacheWasUsed) {
            this.userCache.putUserInCache(user);
        }

        Object principalToReturn = user;
        if (this.forcePrincipalAsString) {
            principalToReturn = user.getUsername();
        }
        //调用认证成功处理器
        return this.createSuccessAuthentication(principalToReturn, authentication, user);
    }
```
* 认证成功处理器
将用户信息和权限认证信息绑定成 tocken认证对象， 返回认证对象
<code>UsernamePasswordAuthenticationToken</code> 继承了 <code>Authentication</code>
```java  
protected Authentication createSuccessAuthentication(Object principal, Authentication authentication, UserDetails user) {
        UsernamePasswordAuthenticationToken result = new UsernamePasswordAuthenticationToken(principal, authentication.getCredentials(), this.authoritiesMapper.mapAuthorities(user.getAuthorities()));
        result.setDetails(authentication.getDetails());
        return result;
    }
```

* 自定义的Provider ()
```java  
@Component
public class JwtAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {
    private static final String DEFAULT_USER_ROLE = "ROLE_USER";
    private static final String DEFAULT_JWT_ROLE = "ROLE_JWT_USER";

    @Resource
    private JwtUtil jwtUtil;
    @Resource
    private UserServiceEx userServiceEx;
    @Resource
    private JwtAuthenticationService jwtAuthenticationService;

    @Override
    public boolean supports(Class<?> authentication) {
        return (JwtAuthenticationToken.class.isAssignableFrom(authentication));
    }

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails,
                                                  UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
        // 如果需要连接数据库查询User状态，可以增强该方法

    }

     //进行权限认证
    @Override
    protected UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken authentication)
            throws AuthenticationException {
        JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
        String token = jwtAuthenticationToken.getToken();

        JwtUser parsedUser;
        try {
            //解析tocken(一个Jwt格式的tocken，可以存放用户信息，可以在登录成功后设置到响应体中（response），返回给前台)
            parsedUser = jwtUtil.parseToken(token);
        } catch (ExpiredJwtException e) {
            throw new BadCredentialsException("Expired jwt token", e);
        } catch (Exception e) {
            throw new BadCredentialsException("Bad jwt token", e);
        }

        if (parsedUser == null) {
            throw new BadCredentialsException("JWT token is not valid");
        }
        //获取缓存用户
        User user = userServiceEx.getUserCache(parsedUser.getUserId());
        // 数据库token字段为空，说明该用户被剔除掉登录状态
        if (StringUtils.isBlank(user.getJwtToken())) {
            throw new CredentialsExpiredException("Expired jwt token");
        }
        // 数据补偿，集群多节点时需求更新一下
        if (!StringUtils.equals(token, user.getJwtToken())) {
            userServiceEx.removeUserCache(parsedUser.getUserId());
            user = userServiceEx.getUserCache(parsedUser.getUserId());
        }
        // 颁发的token跟接口的不一致，请求失败
        if (!StringUtils.equals(token, user.getJwtToken())) {
            throw new BadCredentialsException("JWT token is not valid");
        }
        //上面的认证都通过了，设置权限
        parsedUser.setAuthorities(getAuthorities(parsedUser.getUserId()));
        return parsedUser;
    }

    /**
     * 获取权限列表
     * @param userId 用户ID
     * @return List<SimpleGrantedAuthority>
     */
    private List<SimpleGrantedAuthority> getAuthorities(Long userId) {
        List<SimpleGrantedAuthority> list = new ArrayList<>();
        list.add(new SimpleGrantedAuthority(DEFAULT_USER_ROLE));
        list.add(new SimpleGrantedAuthority(DEFAULT_JWT_ROLE));
        List<String> ecApiAuthList = jwtAuthenticationService.getApiAuthList(userId);
        for (String ecApiAuth : ecApiAuthList) {
            list.add(new SimpleGrantedAuthority(ecApiAuth));
        }
        return list;
    }

```
> 在UserNamePasswordProvider中，也可以在该扩展类的 retrieveUser 方法中调用 UserDetailsService 这个接口的实现类的 loadUserByUsername 方法去获取用户信息，而这里我自己编写了实现类 UserDetailsServiceImpl 类，在这个实现类中，我们可以编写自己的逻辑，从数据库中获取用户密码等权限信息返回。
 自定义实现UserDetailService ，实现loadUserByUsername(String username) 获取数据库用户信息
 
 * SpringSecurity 具体配置
 
 ```java  
     @Override
     public void configure(WebSecurity web) throws Exception {
         super.configure(web);
         //设置静态资源不被拦截
         if (profileUtil.isDev()) {
             // swagger ui
             web.ignoring().antMatchers("/swagger-ui.html**", "/webjars/**",
                     "/swagger-resources/**", "/v2/api-docs", "/csrf");
         }
     }
 
    
     @Override
     protected void configure(HttpSecurity http) throws Exception {
         //设置具体的拦截请求
         http.csrf().disable().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                 .and().authorizeRequests().antMatchers(CommonConstants.ApiUrl.LOGIN).permitAll()
                 .anyRequest().authenticated();
 
         if (profileUtil.isDev()) {
             http.cors().configurationSource(corsConfigurationSource());
         }
         // 添加JWT filter 验证其他请求的Token是否合法
         jwtAuthenticationFilter.setAuthenticationManager(authenticationManager());
         jwtAuthenticationFilter.setAuthenticationSuccessHandler(jwtAuthenticationSuccessHandler);
         http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
     }
 
     @Override
     protected void configure(AuthenticationManagerBuilder auth) throws Exception {
         //配置自定义的认证Provider
         auth.authenticationProvider(jwtAuthenticationProvider);
     }

 ```
 <code>configure(AuthenticationManagerBuilder)</code>用于通过允许AuthenticationProvider容易地添加来建立认证机制。以下定义了内置认证与内置的“用户”和“管理”登录。
   ```java  
     public void configure(AuthenticationManagerBuilder auth) {
            auth
                .inMemoryAuthentication()
                .withUser("user")
                .password("password")
                .roles("USER")
            .and()
                .withUser("admin")
                .password("password")
                .roles("ADMIN","USER");
    }
   ```
 <code>configure(HttpSecurity)</code>允许基于选择匹配在资源级配置基于网络的安全性。以下示例将以/ admin /开头的网址限制为具有ADMIN角色的用户，并声明任何其他网址需要成功验证。
 
```java  
 protected void configure(HttpSecurity http) throws Exception {
     http
         .authorizeUrls()
         .antMatchers("/admin/**").hasRole("ADMIN")
         .anyRequest().authenticated()
 }
```
<code>configure(WebSecurity)</code>用于影响全局安全性(配置资源，设置调试模式，通过实现自定义防火墙定义拒绝请求)的配置设置。例如，以下方法将导致以/ resources /开头的任何请求被忽略以用于认证目的。
 
 ```java  
 public void configure(WebSecurity web) throws Exception {
      web
          .ignoring()
          .antMatchers("/resources/**");
  }
 ```
 
 ## 总结
 * 请求 -> filter -> Manager(分配管理指定的Provider) -> Provider(自定义的权限认证 <code>retrieveUser</code>) -> 通过认证 -> 设置权限和认证信息    
 * 可以有不同的filter 和 Provider 。 coder可以通过自定义继承 <code>AbstractAuthenticationProcessingFilter</code> 和 <code>AbstractUserDetailsAuthenticationProvider</code>
 实现自己的过滤 认证体系
 






