import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

const EMPTY_FORM = {
  email: '',
  name: '',
  phone: '',
  address: '',
  city: '',
  bio: '',
  profileImage: '',
};

const roleLabels = {
  admin: 'Administrator',
  manager: 'Manager',
  guest: 'Guest',
  user: 'Customer',
};

const getProfileCompletion = (form) => {
  const fields = [form.name, form.email, form.phone, form.address, form.city, form.bio, form.profileImage];
  const completed = fields.filter((field) => String(field || '').trim()).length;
  return Math.round((completed / fields.length) * 100);
};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { showToast } = useToast();
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      email: user?.email || '',
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      bio: user?.bio || '',
      profileImage: user?.profileImage || '',
    });
  }, [user]);

  const displayName = form.name || user?.name || 'Your Profile';
  const avatarInitial = displayName[0]?.toUpperCase() || 'U';
  const roleLabel = roleLabels[user?.role] || 'Customer';
  const profileCompletion = useMemo(() => getProfileCompletion(form), [form]);

  const profileStats = useMemo(
    () => [
      { label: 'Account Type', value: roleLabel },
      { label: 'Email Status', value: form.email ? 'Verified Profile' : 'Not Set' },
      { label: 'Contact', value: form.phone || 'Add phone number' },
      { label: 'Profile Completion', value: `${profileCompletion}%` },
    ],
    [form.email, form.phone, profileCompletion, roleLabel]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({
      email: user?.email || '',
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      bio: user?.bio || '',
      profileImage: user?.profileImage || '',
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await updateProfile({
        email: form.email,
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        bio: form.bio,
        profileImage: form.profileImage,
      });

      setEditing(false);
      showToast('Profile updated successfully.', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
    navigate('/');
  };

  const handleProfileImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const nextProfileImage = String(reader.result || '');
      const nextForm = {
        ...form,
        profileImage: nextProfileImage,
      };

      setForm(nextForm);

      try {
        await updateProfile({
          email: nextForm.email,
          name: nextForm.name,
          phone: nextForm.phone,
          address: nextForm.address,
          city: nextForm.city,
          bio: nextForm.bio,
          profileImage: nextProfileImage,
        });
        showToast('Profile photo saved successfully.', 'success');
      } catch (error) {
        showToast(error.message || 'Unable to save profile photo.', 'error');
      }
    };
    reader.onerror = () => showToast('Unable to read selected image.', 'error');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  if (!user) {
    return (
      <div className="py-12 text-center text-slate-500">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white md:px-8">
            <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="pointer-events-none absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl"></div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative">
                  {form.profileImage ? (
                    <img
                      src={form.profileImage}
                      alt={displayName}
                      className="h-24 w-24 rounded-full border-4 border-white/20 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-3xl font-black text-white shadow-lg">
                      {avatarInitial}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 right-0 rounded-full bg-blue-600 p-2 text-white shadow-lg transition hover:bg-blue-500"
                    aria-label="Upload profile photo"
                  >
                    <i className="bi bi-camera-fill" aria-hidden="true"></i>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImage}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
                    Personal account
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight">{displayName}</h1>
                  <p className="mt-1 text-sm text-slate-300">{form.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100">
                      {roleLabel}
                    </span>
                    <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                      {profileCompletion}% complete
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                {profileStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-8 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Account overview</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Keep your contact details and delivery profile up to date.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing((current) => !current)}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    {editing ? 'Preview' : 'Edit Profile'}
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    { label: 'Full Name', value: form.name || 'Not set yet' },
                    { label: 'Email Address', value: form.email || 'Not set yet' },
                    { label: 'Phone Number', value: form.phone || 'Add your phone number' },
                    { label: 'City', value: form.city || 'Add your city' },
                    { label: 'Address', value: form.address || 'Add your shipping address' },
                    { label: 'Bio', value: form.bio || 'Add a short profile summary' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-700">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Quick actions</h2>
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    onClick={() => navigate('/orders')}
                    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    View My Orders
                  </button>
                  <button
                    onClick={() => navigate('/wishlist')}
                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Open Wishlist
                  </button>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Profile settings</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add more professional account details, photo, and contact information.
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                  {editing ? 'Editing' : 'View mode'}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Profile strength</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Complete your profile for a more professional account presence.
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{profileCompletion}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Full Name</span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-50"
                      placeholder="Kamran Khan"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Email Address</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={!editing}
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-50"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Phone Number</span>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-50"
                      placeholder="+92 300 1234567"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">City</span>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-50"
                      placeholder="Karachi"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Address</span>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-50"
                    placeholder="Street, area, apartment"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Short Bio</span>
                  <textarea
                    name="bio"
                    rows="5"
                    value={form.bio}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-50"
                    placeholder="Tell us a little about your shopping preferences or work profile."
                  />
                </label>

                {editing && (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
