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

    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [form, setForm] = useState({ name: "", price: "", description: "", image_url: "" })

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

    const handleDelete = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return
        const { error } = await adminClient.from("products").delete().eq("id", id)
        if (error) alert(error.message)
        else {
            alert("تم الحذف ✅")
            fetchData()
        }
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        setForm(product)
        setShowModal(true)
    }

    const handleSave = async () => {
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

                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setEditingProduct(null)
                                setForm({ name: "", price: "", description: "", image_url: "" })
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        >
                            <PlusCircle size={18} /> إضافة منتج
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProduct ? "✏️ تعديل المنتج" : "➕ إضافة منتج جديد"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
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
                        </div>

                        <DialogFooter>
                            <Button
                                onClick={handleSave}
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-4"
                            >
                                {editingProduct ? "💾 حفظ التعديلات" : "إضافة المنتج"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {products.map((p) => (
                    <motion.div
                        key={p.id}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
                    >
                        <img
                            src={p.image_url}
                            alt={p.name}
                            className="rounded-lg w-full h-40 object-cover"
                        />
                        <h3 className="mt-2 font-bold text-gray-900 dark:text-gray-100">{p.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{p.price} جنيه</p>

                        <div className="flex justify-end gap-2 mt-3">
                            <Button
                                size="icon"
                                onClick={() => handleEdit(p)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white"
                            >
                                <Edit size={16} />
                            </Button>
                            <Button
                                size="icon"
                                onClick={() => handleDelete(p.id)}
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
                <p>👥 المستخدمين (هنضيفها بعدين)</p>
            ) : (
                <p>🧾 الطلبات (هنضيفها قريب)</p>
            )}
        </section>
    )
}
