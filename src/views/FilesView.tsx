import React, { useState } from 'react';
import { AgentNode, FileChange, MissionData } from '../types';
import {
  FileCode2,
  Check,
  Copy,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FilesViewProps {
  mission: MissionData;
  agents: AgentNode[];
  onNavigateToTab: (tab: string) => void;
  onApproveAllChanges?: () => void;
}

export const FilesView: React.FC<FilesViewProps> = ({
  mission,
  agents,
  onApproveAllChanges,
}) => {
  const { isDark } = useTheme();
  const allFiles: FileChange[] = agents.flatMap((a) => a.files);
  const [selectedFile, setSelectedFile] = useState<FileChange>(allFiles[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [validated, setValidated] = useState(false);

  const filteredFiles = allFiles.filter(
    (f) =>
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.directory.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      original: ['// Fichier non existant sur la branche principale main.'],
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
    'jwt.strategy.spec.ts': {
      original: ['// Nouveau test unitaire'],
      modified: [
        "import { Test, TestingModule } from '@nestjs/testing';",
        "import { JwtStrategy } from './jwt.strategy';",
        '',
        "describe('JwtStrategy', () => {",
        '  let strategy: JwtStrategy;',
        '',
        '  beforeEach(async () => {',
        '    const module: TestingModule = await Test.createTestingModule({',
        '      providers: [JwtStrategy],',
        '    }).compile();',
        '    strategy = module.get<JwtStrategy>(JwtStrategy);',
        '  });',
        '',
        "  it('should be defined', () => {",
        '    expect(strategy).toBeDefined();',
        '  });',
        '});',
      ],
    },
  };

  const activeDiff =
    sampleDiffs[selectedFile?.path] ||
    sampleDiffs['auth.module.ts'];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeDiff.modified.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidate = () => {
    setValidated(true);
    if (onApproveAllChanges) onApproveAllChanges();
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden font-mono p-4 md:p-6 gap-4 transition-colors duration-200 ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Bar (No borders) */}
      <div
        className={`px-6 py-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-sm transition-colors ${
          isDark ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <span className={`text-sm font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Espace Git & Différences
            </span>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold ${
                isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {allFiles.length} fichiers modifiés
            </span>
          </div>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Branche : <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mission.branch}</strong> (+480 / -24 lignes)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier patch'}</span>
          </button>

          <button
            onClick={handleValidate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{validated ? 'Validé' : 'Créer Pull Request'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left File Tree Directory (No borders) */}
        <div
          className={`w-72 rounded-2xl p-4 flex flex-col shrink-0 shadow-sm transition-colors ${
            isDark ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer les fichiers..."
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none transition-colors ${
                isDark
                  ? 'bg-slate-900/80 hover:bg-slate-900 focus:bg-slate-900 text-slate-100 placeholder:text-slate-500'
                  : 'bg-slate-50 hover:bg-slate-100 focus:bg-slate-100 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          <p className={`text-[10px] uppercase px-1 py-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Arborescence
          </p>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile?.path === file.path;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold shadow-2xs'
                        : 'bg-emerald-100 text-emerald-900 font-bold shadow-2xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCode2
                      className={`w-4 h-4 shrink-0 ${
                        isSelected
                          ? isDark
                            ? 'text-emerald-400'
                            : 'text-emerald-700'
                          : isDark
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    />
                    <div className="truncate">
                      <p className={`truncate text-xs font-semibold ${
                        isSelected
                          ? isDark
                            ? 'text-emerald-300'
                            : 'text-emerald-900'
                          : isDark
                          ? 'text-slate-200'
                          : 'text-slate-900'
                      }`}>
                        {file.path}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">{file.directory}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] shrink-0 font-bold">
                    <span className={isDark ? 'text-emerald-400' : 'text-teal-600'}>+{file.linesAdded}</span>
                    {file.linesRemoved > 0 && <span className="text-rose-500">-{file.linesRemoved}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Diff Viewer (No borders) */}
        <div
          className={`flex-1 flex flex-col rounded-2xl overflow-hidden shadow-sm transition-colors ${
            isDark ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          {/* File Tab Bar */}
          <div
            className={`px-6 py-3 flex items-center justify-between text-xs transition-colors ${
              isDark ? 'bg-slate-900/60 text-slate-400' : 'bg-slate-50 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileCode2 className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedFile?.directory}{selectedFile?.path}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                  isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {selectedFile?.size || '1,24 Ko'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className={isDark ? 'text-emerald-400' : 'text-teal-700'}>+{selectedFile?.linesAdded} lignes</span>
              {selectedFile?.linesRemoved ? (
                <span className="text-rose-500">-{selectedFile?.linesRemoved} lignes</span>
              ) : null}
            </div>
          </div>

          {/* Diff Content View */}
          <div className="flex-1 overflow-y-auto p-6 text-xs space-y-1 bg-slate-950 text-slate-100 rounded-b-2xl">
            {activeDiff.modified.map((line, idx) => {
              const isNew = !activeDiff.original.includes(line);
              return (
                <div
                  key={idx}
                  className={`flex items-start px-2 py-0.5 rounded-md leading-relaxed transition-colors ${
                    isNew
                      ? 'bg-emerald-950/80 text-emerald-300'
                      : 'text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="w-8 text-slate-500 select-none shrink-0 text-right pr-3 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="w-4 select-none shrink-0 text-center text-slate-400 font-bold">
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
  );
};
