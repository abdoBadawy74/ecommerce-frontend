import { supabase } from '../lib/supabaseClient'

export async function getProducts() {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProduct(id) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

// Admin actions (تعمل فقط إذا كان المستخدم admin وRLS يسمح)
export async function createProduct(product) {
  const { data, error } = await supabase.from('products').insert([product]).select()
  if (error) throw error
  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
  return true
}
