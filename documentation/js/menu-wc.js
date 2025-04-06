'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">base-nestjs documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-da215d718303a8b2feb90b711ebee951951932153f7629b46a07a419837ae2213bc8e84a70b6dfbafa8bc2180e58862efabd98025f3054a530fb6f4dcf01dab4"' : 'data-bs-target="#xs-controllers-links-module-AppModule-da215d718303a8b2feb90b711ebee951951932153f7629b46a07a419837ae2213bc8e84a70b6dfbafa8bc2180e58862efabd98025f3054a530fb6f4dcf01dab4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-da215d718303a8b2feb90b711ebee951951932153f7629b46a07a419837ae2213bc8e84a70b6dfbafa8bc2180e58862efabd98025f3054a530fb6f4dcf01dab4"' :
                                            'id="xs-controllers-links-module-AppModule-da215d718303a8b2feb90b711ebee951951932153f7629b46a07a419837ae2213bc8e84a70b6dfbafa8bc2180e58862efabd98025f3054a530fb6f4dcf01dab4"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-da215d718303a8b2feb90b711ebee951951932153f7629b46a07a419837ae2213bc8e84a70b6dfbafa8bc2180e58862efabd98025f3054a530fb6f4dcf01dab4"' : 'data-bs-target="#xs-injectables-links-module-AppModule-da215d718303a8b2feb90b711ebee951951932153f7629b46a07a419837ae2213bc8e84a70b6dfbafa8bc2180e58862efabd98025f3054a530fb6f4dcf01dab4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-da215d718303a8b2feb90b711ebee951951932153f7629b46a07a419837ae2213bc8e84a70b6dfbafa8bc2180e58862efabd98025f3054a530fb6f4dcf01dab4"' :
                                        'id="xs-injectables-links-module-AppModule-da215d718303a8b2feb90b711ebee951951932153f7629b46a07a419837ae2213bc8e84a70b6dfbafa8bc2180e58862efabd98025f3054a530fb6f4dcf01dab4"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-9d691e4a8968d69ada3b77c6844fb6e6fd015ed174d8e85a0afd0098d552c3294942268c7855c21f6e82a820c6658b1c8d8f4459aa9fa63ca1073ff520e12901"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-9d691e4a8968d69ada3b77c6844fb6e6fd015ed174d8e85a0afd0098d552c3294942268c7855c21f6e82a820c6658b1c8d8f4459aa9fa63ca1073ff520e12901"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-9d691e4a8968d69ada3b77c6844fb6e6fd015ed174d8e85a0afd0098d552c3294942268c7855c21f6e82a820c6658b1c8d8f4459aa9fa63ca1073ff520e12901"' :
                                            'id="xs-controllers-links-module-AuthModule-9d691e4a8968d69ada3b77c6844fb6e6fd015ed174d8e85a0afd0098d552c3294942268c7855c21f6e82a820c6658b1c8d8f4459aa9fa63ca1073ff520e12901"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-9d691e4a8968d69ada3b77c6844fb6e6fd015ed174d8e85a0afd0098d552c3294942268c7855c21f6e82a820c6658b1c8d8f4459aa9fa63ca1073ff520e12901"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-9d691e4a8968d69ada3b77c6844fb6e6fd015ed174d8e85a0afd0098d552c3294942268c7855c21f6e82a820c6658b1c8d8f4459aa9fa63ca1073ff520e12901"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-9d691e4a8968d69ada3b77c6844fb6e6fd015ed174d8e85a0afd0098d552c3294942268c7855c21f6e82a820c6658b1c8d8f4459aa9fa63ca1073ff520e12901"' :
                                        'id="xs-injectables-links-module-AuthModule-9d691e4a8968d69ada3b77c6844fb6e6fd015ed174d8e85a0afd0098d552c3294942268c7855c21f6e82a820c6658b1c8d8f4459aa9fa63ca1073ff520e12901"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MailModule-80cf34fc6965a9b5a920585c759a52d624dc33cb594f3bc67200d56a441f1eac10c06f34f4be0e1a9d7ce8c5698b3f0d9a85091d0174147632e41987babc6ccd"' : 'data-bs-target="#xs-controllers-links-module-MailModule-80cf34fc6965a9b5a920585c759a52d624dc33cb594f3bc67200d56a441f1eac10c06f34f4be0e1a9d7ce8c5698b3f0d9a85091d0174147632e41987babc6ccd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MailModule-80cf34fc6965a9b5a920585c759a52d624dc33cb594f3bc67200d56a441f1eac10c06f34f4be0e1a9d7ce8c5698b3f0d9a85091d0174147632e41987babc6ccd"' :
                                            'id="xs-controllers-links-module-MailModule-80cf34fc6965a9b5a920585c759a52d624dc33cb594f3bc67200d56a441f1eac10c06f34f4be0e1a9d7ce8c5698b3f0d9a85091d0174147632e41987babc6ccd"' }>
                                            <li class="link">
                                                <a href="controllers/MailController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MailModule-80cf34fc6965a9b5a920585c759a52d624dc33cb594f3bc67200d56a441f1eac10c06f34f4be0e1a9d7ce8c5698b3f0d9a85091d0174147632e41987babc6ccd"' : 'data-bs-target="#xs-injectables-links-module-MailModule-80cf34fc6965a9b5a920585c759a52d624dc33cb594f3bc67200d56a441f1eac10c06f34f4be0e1a9d7ce8c5698b3f0d9a85091d0174147632e41987babc6ccd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailModule-80cf34fc6965a9b5a920585c759a52d624dc33cb594f3bc67200d56a441f1eac10c06f34f4be0e1a9d7ce8c5698b3f0d9a85091d0174147632e41987babc6ccd"' :
                                        'id="xs-injectables-links-module-MailModule-80cf34fc6965a9b5a920585c759a52d624dc33cb594f3bc67200d56a441f1eac10c06f34f4be0e1a9d7ce8c5698b3f0d9a85091d0174147632e41987babc6ccd"' }>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-368172fae3492c819b686754eeac431c597c5b97928b67ec30423c7e468d984012d8a4f86e7cccc7ce624888e9230242a8d24eb44faec515da7b489612fefe88"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-368172fae3492c819b686754eeac431c597c5b97928b67ec30423c7e468d984012d8a4f86e7cccc7ce624888e9230242a8d24eb44faec515da7b489612fefe88"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-368172fae3492c819b686754eeac431c597c5b97928b67ec30423c7e468d984012d8a4f86e7cccc7ce624888e9230242a8d24eb44faec515da7b489612fefe88"' :
                                            'id="xs-controllers-links-module-UsersModule-368172fae3492c819b686754eeac431c597c5b97928b67ec30423c7e468d984012d8a4f86e7cccc7ce624888e9230242a8d24eb44faec515da7b489612fefe88"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-368172fae3492c819b686754eeac431c597c5b97928b67ec30423c7e468d984012d8a4f86e7cccc7ce624888e9230242a8d24eb44faec515da7b489612fefe88"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-368172fae3492c819b686754eeac431c597c5b97928b67ec30423c7e468d984012d8a4f86e7cccc7ce624888e9230242a8d24eb44faec515da7b489612fefe88"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-368172fae3492c819b686754eeac431c597c5b97928b67ec30423c7e468d984012d8a4f86e7cccc7ce624888e9230242a8d24eb44faec515da7b489612fefe88"' :
                                        'id="xs-injectables-links-module-UsersModule-368172fae3492c819b686754eeac431c597c5b97928b67ec30423c7e468d984012d8a4f86e7cccc7ce624888e9230242a8d24eb44faec515da7b489612fefe88"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MailController.html" data-type="entity-link" >MailController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/RefreshToken.html" data-type="entity-link" >RefreshToken</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuditBaseEntity.html" data-type="entity-link" >AuditBaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntity.html" data-type="entity-link" >BaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DateHelper.html" data-type="entity-link" >DateHelper</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationDto.html" data-type="entity-link" >PaginationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordHelper.html" data-type="entity-link" >PasswordHelper</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshToken.html" data-type="entity-link" >RefreshToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link" >RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserFilterDto.html" data-type="entity-link" >UserFilterDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuditSubscriber.html" data-type="entity-link" >AuditSubscriber</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailService.html" data-type="entity-link" >MailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransformInterceptor.html" data-type="entity-link" >TransformInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IUser.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Pagination.html" data-type="entity-link" >Pagination</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginationMeta.html" data-type="entity-link" >PaginationMeta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginationOptions.html" data-type="entity-link" >PaginationOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Response.html" data-type="entity-link" >Response</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserFilter.html" data-type="entity-link" >UserFilter</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});