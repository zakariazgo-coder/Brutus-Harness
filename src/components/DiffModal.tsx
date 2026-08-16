import React, { useState } from 'react';
import { FileChange } from '../types';
import {
  X,
  GitPullRequest,
  Check,
  Copy,
  FileCode2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DiffModalProps {
  files: FileChange[];
  selectedFile?: FileChange | null;
  onClose: () => void;
  onApproveDiff: () => void;
}

export const DiffModal: React.FC<DiffModalProps> = ({
  files,
  selectedFile: initialSelectedFile,
  onClose,
  onApproveDiff,
}) => {
  const { isDark } = useTheme();
  const [currentFile, setCurrentFile] = useState<FileChange>(
    initialSelectedFile || files[0] || {
      id: 'default',
      path: 'auth.module.ts',
      directory: 'backend/src/auth/',
      status: 'modified',
      linesAdded: 52,
      linesRemoved: 4,
      size: '1,24 Ko',
    }
  );
  const [copied, setCopied] = useState(false);

  const sampleDiffs: Record<string, { original: string[]; modified: string[] }> = {
    'auth.module.ts': {
      original: [
        "import { Module } from '@nestjs/common';",
        "import { UsersModule } from '../users/users.module';",
        '',
        '@Module({',
        '  imports: [UsersModule],',
        '  controllers: [],',
        '  providers: [],',
        '  exports: [],',
        '})',
        'export class AuthModule {}',
      ],
      modified: [
        "import { Module } from '@nestjs/common';",
        "import { JwtModule } from '@nestjs/jwt';",
        "import { PassportModule } from '@nestjs/passport';",
        "import { UsersModule } from '../users/users.module';",
        "import { AuthService } from './auth.service';",
        "import { AuthController } from './auth.controller';",
        "import { JwtStrategy } from './jwt.strategy';",
        '',
        '@Module({',
        '  imports: [',
        '    UsersModule,',
        "    PassportModule.register({ defaultStrategy: 'jwt' }),",
        '    JwtModule.register({',
        '      secret: process.env.JWT_SECRET,',
        "      signOptions: { expiresIn: '15m' },",
        '    }),',
        '  ],',
        '  controllers: [AuthController],',
        '  providers: [AuthService, JwtStrategy],',
        '  exports: [AuthService, JwtModule],',
        '})',
        'export class AuthModule {}',
      ],
    },
    'user.model.ts': {
      original: [
        'export interface User {',
        '  id: string;',
        '  email: string;',
        '  name: string;',
        '  createdAt: Date;',
        '}',
      ],
      modified: [
        'export interface User {',
        '  id: string;',
        '  email: string;',
        '  name: string;',
        '  passwordHash: string;',
        "  roles: ('ADMIN' | 'DEV' | 'AUDITOR')[];",
        '  refreshTokenHash?: string;',
        '  lastLoginAt?: Date;',
        '  createdAt: Date;',
        '  updatedAt: Date;',
        '}',
      ],
    },
    'auth.service.ts': {
      original: ['// Fichier non existant sur la branche principale.'],
      modified: [
        "import { Injectable, UnauthorizedException } from '@nestjs/common';",
        "import { JwtService } from '@nestjs/jwt';",
        "import * as bcrypt from 'bcrypt';",
        "import { UsersService } from '../users/users.service';",
        '',
        '@Injectable()',
        'export class AuthService {',
        '  constructor(',
        '    private usersService: UsersService,',
        '    private jwtService: JwtService,',
        '  ) {}',
        '',
        '  async validateUser(email: string, pass: string): Promise<any> {',
        '    const user = await this.usersService.findByEmail(email);',
        '    if (user && await bcrypt.compare(pass, user.passwordHash)) {',
        '      const { passwordHash, ...result } = user;',
        '      return result;',
        '    }',
        '    return null;',
        '  }',
        '',
        '  async login(user: any) {',
        '    const payload = { email: user.email, sub: user.id, roles: user.roles };',
        '    return {',
        '      accessToken: this.jwtService.sign(payload),',
        "      tokenType: 'Bearer',",
        '      expiresIn: 900,',
        '    };',
        '  }',
        '}',
      ],
    },
  };

  const activeDiff = sampleDiffs[currentFile.path] || sampleDiffs['auth.module.ts'];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeDiff.modified.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-150">
      <div className={`rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between transition-colors ${
          isDark ? 'bg-slate-800/90' : 'bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Inspecteur de Différences Git
                </h2>
                <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                  isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {files.length} fichiers modifiés
                </span>
              </div>
              <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Branche : <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>feat/auth-jwt-system</span> → main
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer font-medium ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
            <button
              onClick={() => {
                onApproveDiff();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono transition-colors cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Valider les changements</span>
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar File Tree + Diff View */}
        <div className="flex-1 flex overflow-hidden">
          {/* File selector sidebar */}
          <div className={`w-72 p-3 overflow-y-auto space-y-1 transition-colors ${
            isDark ? 'bg-slate-800/60' : 'bg-slate-50'
          }`}>
            <p className={`text-[10px] font-mono uppercase px-2 py-1 font-bold ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Fichiers touchés
            </p>
            {files.map((file) => {
              const isSelected = currentFile.path === file.path;
              return (
                <button
                  key={file.id}
                  onClick={() => setCurrentFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-slate-700 text-white font-bold shadow-xs ring-1 ring-emerald-500/50'
                        : 'bg-white text-slate-900 font-bold shadow-xs ring-1 ring-emerald-500/30'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCode2
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-emerald-500' : isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    />
                    <div className="truncate">
                      <p className="truncate text-xs font-medium">{file.path}</p>
                      <p className={`text-[9px] truncate ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{file.directory}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] shrink-0 font-bold">
                    <span className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>+{file.linesAdded}</span>
                    {file.linesRemoved > 0 && <span className="text-rose-500">-{file.linesRemoved}</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Diff Viewer Pane */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden text-slate-100">
            <div className="px-4 py-2 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-slate-300 font-medium">{currentFile.directory}{currentFile.path}</span>
              <div className="flex items-center gap-3 font-bold">
                <span className="text-emerald-400">+{currentFile.linesAdded} lignes</span>
                <span className="text-rose-400">-{currentFile.linesRemoved} lignes</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
              {activeDiff.modified.map((line, idx) => {
                const isNew = !activeDiff.original.includes(line);
                return (
                  <div
                    key={idx}
                    className={`flex items-start px-2 py-0.5 rounded leading-relaxed ${
                      isNew
                        ? 'bg-emerald-950/60 text-emerald-300'
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="w-8 text-slate-500 select-none shrink-0 text-right pr-3 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="w-4 select-none shrink-0 font-bold">
                      {isNew ? '+' : ' '}
                    </span>
                    <pre className="font-mono whitespace-pre-wrap">{line}</pre>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
