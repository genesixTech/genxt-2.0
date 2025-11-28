const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { User, UserProfile, Settings } = require('../models');
const { formatProperName } = require('../utils/helpers');

// Configuração da estratégia Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar se usuário já existe
      let user = await User.findOne({
        where: {
          $or: [
            { email: profile.emails[0].value },
            { provider_id: profile.id, provider: 'google' }
          ]
        },
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
        ],
      });

      if (user) {
        // Atualizar dados se necessário
        if (user.provider !== 'google' || user.provider_id !== profile.id) {
          await user.update({
            provider: 'google',
            provider_id: profile.id,
            avatar_url: profile.photos[0]?.value || user.avatar_url,
            ultimo_login: new Date(),
          });
        } else {
          await user.update({ ultimo_login: new Date() });
        }
        
        return done(null, user);
      }

      // Criar novo usuário
      user = await User.create({
        nome: formatProperName(profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName),
        email: profile.emails[0].value.toLowerCase(),
        provider: 'google',
        provider_id: profile.id,
        avatar_url: profile.photos[0]?.value,
        email_verificado: true, // Google já verifica o email
        ultimo_login: new Date(),
      });

      // Criar perfil vazio
      await UserProfile.create({
        user_id: user.id,
      });

      // Criar configurações padrão
      await Settings.create({
        user_id: user.id,
      });

      // Buscar usuário completo
      const userWithProfile = await User.findByPk(user.id, {
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
        ],
      });

      return done(null, userWithProfile);

    } catch (error) {
      console.error('Erro na autenticação Google:', error);
      return done(error, null);
    }
  }));
}

// Configuração da estratégia GitHub OAuth
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // GitHub pode não fornecer email público
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      
      if (!email) {
        return done(new Error('Email não disponível no perfil do GitHub'), null);
      }

      // Verificar se usuário já existe
      let user = await User.findOne({
        where: {
          $or: [
            { email: email },
            { provider_id: profile.id, provider: 'github' }
          ]
        },
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
        ],
      });

      if (user) {
        // Atualizar dados se necessário
        if (user.provider !== 'github' || user.provider_id !== profile.id) {
          await user.update({
            provider: 'github',
            provider_id: profile.id,
            avatar_url: profile.photos[0]?.value || user.avatar_url,
            ultimo_login: new Date(),
          });
        } else {
          await user.update({ ultimo_login: new Date() });
        }
        
        return done(null, user);
      }

      // Criar novo usuário
      user = await User.create({
        nome: formatProperName(profile.displayName || profile.username),
        email: email.toLowerCase(),
        provider: 'github',
        provider_id: profile.id,
        avatar_url: profile.photos[0]?.value,
        email_verificado: true, // Assumimos que o GitHub verifica emails
        ultimo_login: new Date(),
      });

      // Criar perfil com informações do GitHub
      await UserProfile.create({
        user_id: user.id,
        github_url: profile.profileUrl,
        bio: profile._json.bio || null,
      });

      // Criar configurações padrão
      await Settings.create({
        user_id: user.id,
      });

      // Buscar usuário completo
      const userWithProfile = await User.findByPk(user.id, {
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
        ],
      });

      return done(null, userWithProfile);

    } catch (error) {
      console.error('Erro na autenticação GitHub:', error);
      return done(error, null);
    }
  }));
}

// Configuração da estratégia LinkedIn OAuth
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || '/api/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      
      if (!email) {
        return done(new Error('Email não disponível no perfil do LinkedIn'), null);
      }

      // Verificar se usuário já existe
      let user = await User.findOne({
        where: {
          $or: [
            { email: email },
            { provider_id: profile.id, provider: 'linkedin' }
          ]
        },
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
        ],
      });

      if (user) {
        // Atualizar dados se necessário
        if (user.provider !== 'linkedin' || user.provider_id !== profile.id) {
          await user.update({
            provider: 'linkedin',
            provider_id: profile.id,
            avatar_url: profile.photos[0]?.value || user.avatar_url,
            ultimo_login: new Date(),
          });
        } else {
          await user.update({ ultimo_login: new Date() });
        }
        
        return done(null, user);
      }

      // Criar novo usuário
      user = await User.create({
        nome: formatProperName(profile.displayName),
        email: email.toLowerCase(),
        provider: 'linkedin',
        provider_id: profile.id,
        avatar_url: profile.photos[0]?.value,
        email_verificado: true, // LinkedIn verifica emails
        ultimo_login: new Date(),
      });

      // Criar perfil com informações do LinkedIn
      await UserProfile.create({
        user_id: user.id,
        linkedin_url: profile._json.publicProfileUrl || null,
      });

      // Criar configurações padrão
      await Settings.create({
        user_id: user.id,
      });

      // Buscar usuário completo
      const userWithProfile = await User.findByPk(user.id, {
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
        ],
      });

      return done(null, userWithProfile);

    } catch (error) {
      console.error('Erro na autenticação LinkedIn:', error);
      return done(error, null);
    }
  }));
}

// Serialização do usuário (não usado em JWT, mas necessário para o Passport)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: UserProfile,
          as: 'profile',
        },
      ],
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
