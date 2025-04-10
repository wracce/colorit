'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Camera,
  Settings,
  Image as ImageIcon,
  Star,
  Calendar,
  Clock,
  Phone,
  Globe,
  Briefcase,
  AtSign,
  LogOut,
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, accessToken, updateProfile, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);
  const [joinDate] = useState('март 2024');

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken, router]);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const stats = [
    { label: 'Фото раскрашено', value: 24, icon: ImageIcon },
    { label: 'Средняя оценка', value: '4.5', icon: Star },
    { label: 'На сайте с', value: joinDate, icon: Calendar },
    { label: 'Среднее время', value: '2.3с', icon: Clock },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData) {
      await updateProfile(userData);
      setIsEditing(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/users/v1/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const avatarId = res.data.id;
      const avatarUrl = `/users/v1/avatar/${avatarId}`;
      await updateProfile({ avatarUrl });
      setUserData(prev => ({ ...prev, avatarUrl }));
    } catch (err) {
      console.error('Ошибка загрузки аватара:', err);
    }
  };

  if (!userData) return null;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-end mb-4">
        <Button variant="destructive" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Профиль</CardTitle>
            <CardDescription>Управляйте своей персональной информацией</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={'api/'+userData.avatarUrl} alt={userData.fullName} />
                    <AvatarFallback>{userData?.fullName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar" className="absolute bottom-0 right-0">
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div className="bg-primary text-white rounded-full p-2 cursor-pointer hover:scale-105 transition">
                      <Camera className="h-4 w-4" />
                    </div>
                  </label>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{userData.location}</p>
                  <p className="text-sm font-medium">{userData.jobTitle}</p>
                  <p className="text-sm text-muted-foreground">{userData.company}</p>
                </div>
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Имя" value={userData.fullName} onChange={(val) => setUserData({ ...userData, fullName: val })} />
                    <InputField label="Email" value={userData.email} type="email" onChange={(val) => setUserData({ ...userData, email: val })} />
                    <InputField label="Телефон" value={userData.phone} type="tel" onChange={(val) => setUserData({ ...userData, phone: val })} />
                    <InputField label="Сайт" value={userData.website} type="url" onChange={(val) => setUserData({ ...userData, website: val })} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Компания" value={userData.company} onChange={(val) => setUserData({ ...userData, company: val })} />
                      <InputField label="Должность" value={userData.jobTitle} onChange={(val) => setUserData({ ...userData, jobTitle: val })} />
                    </div>
                    <InputField label="Город" value={userData.location} onChange={(val) => setUserData({ ...userData, location: val })} />
                    <div className="space-y-2">
                      <Label>О себе</Label>
                      <Textarea
                        value={userData.bio}
                        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Соцсети</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          placeholder="Twitter"
                          value={userData.social?.twitter || ''}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              social: { ...userData.social, twitter: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="Instagram"
                          value={userData.social?.instagram || ''}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              social: { ...userData.social, instagram: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="LinkedIn"
                          value={userData.social?.linkedin || ''}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              social: { ...userData.social, linkedin: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Сохранить</Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Отмена
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <DisplayField label="Имя" value={userData.fullName} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DisplayIconField label="Email" icon={AtSign} value={userData.email} />
                      <DisplayIconField label="Телефон" icon={Phone} value={userData.phone} />
                      <DisplayIconField label="Сайт" icon={Globe} value={userData.website} />
                      <DisplayIconField
                        label="Работа"
                        icon={Briefcase}
                        value={`${userData.jobTitle || ''} ${userData.company || ''}`}
                      />
                    </div>
                    <DisplayField label="О себе" value={userData.bio} />
                    {userData.social && (
                      <div>
                        <Label className="text-muted-foreground">Соцсети</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          {userData.social.twitter && (
                            <DisplayIconField label="Twitter" value={userData.social.twitter} icon={AtSign} />
                          )}
                          {userData.social.instagram && (
                            <DisplayIconField label="Instagram" value={userData.social.instagram} icon={AtSign} />
                          )}
                          {userData.social.linkedin && (
                            <DisplayIconField label="LinkedIn" value={userData.social.linkedin} icon={AtSign} />
                          )}
                        </div>
                      </div>
                    )}
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Редактировать
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Вспомогательные компоненты
const InputField = ({ label, value, onChange, type = 'text' }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input value={value || ''} onChange={(e) => onChange(e.target.value)} type={type} />
  </div>
);

const DisplayField = ({ label, value }) => (
  <div>
    <Label className="text-muted-foreground">{label}</Label>
    <p className="text-base">{value}</p>
  </div>
);

const DisplayIconField = ({ label, value, icon: Icon }) => (
  <div>
    <Label className="text-muted-foreground">{label}</Label>
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="text-sm">{value}</p>
    </div>
  </div>
);
