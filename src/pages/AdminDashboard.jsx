import { useEffect, useState } from "react"
import { supabase, adminClient } from "../lib/supabaseClient"
import { motion } from "framer-motion"
import { Edit, Trash2, PlusCircle } from "lucide-react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AdminDashboard() {
    const [tab, setTab] = useState("products")
    const [products, setProducts] = useState([])
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    // مودال مشترك
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [editingUser, setEditingUser] = useState(null)
    const [editingOrder, setEditingOrder] = useState(null)

    const [form, setForm] = useState({ name: "", price: "", description: "", image_url: "" })
    const [userForm, setUserForm] = useState({ role: "" })
    const [orderForm, setOrderForm] = useState({ status: "" })

    useEffect(() => {
        fetchData()
    }, [tab])

    const fetchData = async () => {
        setLoading(true)
        if (tab === "products") {
            const { data, error } = await supabase.from("products").select("*")
            if (!error) setProducts(data)
        } else if (tab === "users") {
            const { data, error } = await adminClient.from("profiles").select("id,email,role")
            if (!error) setUsers(data)
        } else if (tab === "orders") {
            const { data, error } = await adminClient.from("orders").select("*")
            if (!error) setOrders(data)
        }
        setLoading(false)
    }

    // 🧩 المنتجات
    const handleDeleteProduct = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return
        const { error } = await adminClient.from("products").delete().eq("id", id)
        if (error) alert(error.message)
        else {
            alert("تم الحذف ✅")
            fetchData()
        }
    }

    const handleEditProduct = (product) => {
        setEditingProduct(product)
        setForm(product)
        setShowModal(true)
    }

    const handleSaveProduct = async () => {
        if (!form.name || !form.price) return alert("الاسم والسعر مطلوبان")
        if (editingProduct) {
            const { error } = await adminClient.from("products").update(form).eq("id", editingProduct.id)
            if (error) return alert(error.message)
            alert("تم تعديل المنتج ✅")
        } else {
            const { error } = await adminClient.from("products").insert([form])
            if (error) return alert(error.message)
            alert("تمت إضافة المنتج ✅")
        }
        setShowModal(false)
        setEditingProduct(null)
        setForm({ name: "", price: "", description: "", image_url: "" })
        fetchData()
    }

    // 🧠 المستخدمين
    const handleEditUser = (user) => {
        setEditingUser(user)
        setUserForm({ role: user.role })
        setShowModal(true)
    }

    const handleSaveUser = async () => {
        const { error } = await adminClient
            .from("profiles")
            .update({ role: userForm.role })
            .eq("id", editingUser.id)
        if (error) return alert(error.message)
        alert("تم تعديل المستخدم ✅")
        setShowModal(false)
        setEditingUser(null)
        fetchData()
    }

    // 📦 الطلبات
    const handleEditOrder = (order) => {
        setEditingOrder(order)
        setOrderForm({ status: order.status })
        setShowModal(true)
    }

    const handleSaveOrder = async () => {
        const { error } = await adminClient
            .from("orders")
            .update({ status: orderForm.status })
            .eq("id", editingOrder.id)
        if (error) return alert(error.message)
        alert("تم تعديل حالة الطلب ✅")
        setShowModal(false)
        setEditingOrder(null)
        fetchData()
    }

    const renderTabs = () => (
        <div className="flex justify-center gap-4 mb-8">
            {[
                { key: "products", label: "المنتجات" },
                { key: "users", label: "المستخدمون" },
                { key: "orders", label: "الطلبات" },
            ].map((item) => (
                <button
                    key={item.key}
                    onClick={() => setTab(item.key)}
                    className={`px-4 py-2 rounded-lg font-medium ${tab === item.key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    )

    const renderProducts = () => (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">🛍️ إدارة المنتجات</h2>
                <Button
                    onClick={() => {
                        setEditingProduct(null)
                        setForm({ name: "", price: "", description: "", image_url: "" })
                        setShowModal(true)
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                    <PlusCircle size={18} /> إضافة منتج
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {products.map((p) => (
                    <motion.div
                        key={p.id}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
                    >
                        <img src={p.image_url} alt={p.name} className="rounded-lg w-full h-40 object-cover" />
                        <h3 className="mt-2 font-bold text-gray-900 dark:text-gray-100">{p.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{p.price} جنيه</p>

                        <div className="flex justify-end gap-2 mt-3">
                            <Button
                                size="icon"
                                onClick={() => handleEditProduct(p)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white"
                            >
                                <Edit size={16} />
                            </Button>
                            <Button
                                size="icon"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )

    const renderUsers = () => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">👥 قائمة المستخدمين</h2>
            <table className="w-full text-right">
                <thead className="border-b border-gray-300 dark:border-gray-700">
                    <tr className="text-gray-700 dark:text-gray-300">
                        <th className="py-2">البريد الإلكتروني</th>
                        <th className="py-2">الدور</th>
                        <th className="py-2">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2">{u.email}</td>
                            <td className="py-2">{u.role}</td>
                            <td className="py-2">
                                <Button
                                    size="sm"
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white"
                                    onClick={() => handleEditUser(u)}
                                >
                                    تعديل
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    const renderOrders = () => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">🧾 الطلبات</h2>
            <table className="w-full text-right">
                <thead className="border-b border-gray-300 dark:border-gray-700">
                    <tr className="text-gray-700 dark:text-gray-300">
                        <th className="py-2">المعرف</th>
                        <th className="py-2">المستخدم</th>
                        <th className="py-2">الإجمالي</th>
                        <th className="py-2">الحالة</th>
                        <th className="py-2">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o) => (
                        <tr key={o.id} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2">{o.id}</td>
                            <td className="py-2">{o.user_id}</td>
                            <td className="py-2">{o.total_price} جنيه</td>
                            <td className="py-2">{o.status}</td>
                            <td className="py-2">
                                <Button
                                    size="sm"
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white"
                                    onClick={() => handleEditOrder(o)}
                                >
                                    تعديل
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    return (
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white min-h-screen py-10 px-4">
            <motion.h1
                className="text-4xl font-extrabold text-center mb-10"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                ⚙️ لوحة تحكم الأدمن
            </motion.h1>

            {renderTabs()}

            {loading ? (
                <p className="text-center text-gray-200">جار التحميل...</p>
            ) : tab === "products" ? (
                renderProducts()
            ) : tab === "users" ? (
                renderUsers()
            ) : (
                renderOrders()
            )}

            {/* مودال مشترك للتعديل */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProduct
                                ? "✏️ تعديل المنتج"
                                : editingUser
                                    ? "👤 تعديل المستخدم"
                                    : editingOrder
                                        ? "📦 تعديل الطلب"
                                        : "➕ إضافة منتج جديد"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        {editingProduct || (!editingUser && !editingOrder) ? (
                            <>
                                <Input
                                    placeholder="اسم المنتج"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    placeholder="السعر"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                />
                                <Input
                                    placeholder="رابط الصورة"
                                    value={form.image_url}
                                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                />
                                <Textarea
                                    placeholder="الوصف"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </>
                        ) : editingUser ? (
                            <Input
                                placeholder="الدور (admin / user)"
                                value={userForm.role}
                                onChange={(e) => setUserForm({ role: e.target.value })}
                            />
                        ) : (
                            <Input
                                placeholder="الحالة (pending / paid / cancelled)"
                                value={orderForm.status}
                                onChange={(e) => setOrderForm({ status: e.target.value })}
                            />
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={
                                editingProduct
                                    ? handleSaveProduct
                                    : editingUser
                                        ? handleSaveUser
                                        : editingOrder
                                            ? handleSaveOrder
                                            : handleSaveProduct
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-4"
                        >
                            💾 حفظ التعديلات
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}
